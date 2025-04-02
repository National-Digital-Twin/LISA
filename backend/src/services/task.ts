import { randomUUID } from 'crypto';
import { TaskStatus } from 'common/Task';
import { Request, Response } from 'express';
import TriplePattern from 'rdf-sparql-builder/lib/TriplePattern';
import { create as createNotification } from './notifications';
import { ApplicationError, InvalidValueError } from '../errors';
import { literalDate, literalString, nodeValue, ns } from '../rdfutil';
import * as ia from '../ia';

/*
  Since we should not be deleting data in the triplestore and instead
  creating an immutable log of changes, we create "boundings" for both
  changeable aspects of a Task; Status + Assignee. Using these, we only
  fetch the latest of these states for the UI, however the history of a task
  can be queried directly against the graph. The methods below close the 
  previous boundings and create new ones with the new states.
*/


function removePrefix(uri: string): string {
  return uri.split('#').pop() || uri.split('/').pop() || uri;
}

export async function changeStatus(req: Request, res: Response) {
  const { taskId } = req.params;
  const { status: rawStatus } = req.body;

  const status = TaskStatus.check(rawStatus);
  const now = new Date();

  const taskStatusValues = TaskStatus.alternatives.map((literal) => literal.value);
  const allowedStatusTypes = taskStatusValues
    .map((s) => `<${ns.lisa(s).value}>`)
    .join(', ');

  const taskIdNode = ns.data(taskId);
  const statusNodeType = ns.lisa(status);

  const notExistsFilter = new TriplePattern('?x', ns.ies.isEndOf, '?currentStatus');

  // Find current active status (i.e., without isEndOf)
  const results = await ia.select({
    selection: ['?currentStatus', '?statusType'],
    clause: [
      ['?currentStatus', ns.ies.isStateOf, taskIdNode],
      ['?currentStatus', ns.rdf.type, '?statusType'],
      ['?bounding', ns.ies.isStartOf, '?currentStatus'],
      ['?bounding', ns.ies.inPeriod, '?start'],
      `FILTER NOT EXISTS {${notExistsFilter}}`,
      `FILTER(?statusType IN (${allowedStatusTypes}))`
    ]
  });

  if (results.length > 1) {
    throw new ApplicationError(
      `Query for current status of task ${taskId} returned multiple results.`
    );
  }

  const newStatusNode = ns.data(randomUUID());
  const newBoundingNode = ns.data(randomUUID());
  const nowNode = literalDate(now);

  const triples = [
    // New status node
    [newStatusNode, ns.rdf.type, statusNodeType],
    [newStatusNode, ns.ies.isStateOf, taskIdNode],
    [newBoundingNode, ns.ies.inPeriod, nowNode],
    [newBoundingNode, ns.ies.isStartOf, newStatusNode]
  ];

  // Close the previous status node if one exists
  if (results.length === 1) {
    const previousStatusNode = ns.data(nodeValue(results[0].currentStatus.value));
    const closeBoundingNode = ns.data(randomUUID());
    triples.push(
      [closeBoundingNode, ns.ies.inPeriod, nowNode],
      [closeBoundingNode, ns.ies.isEndOf, previousStatusNode]
    );

    const previousStatusType = results[0].statusType.value;
    if (removePrefix(previousStatusType) === status) {
      throw new InvalidValueError('New status is the same as the current status');
    }
  }

  await ia.insertData(triples);

  res.status(200).json({ message: "Status changed successfully" });
}

export async function changeAssignee(req: Request, res: Response) {
  const { taskId } = req.params;
  const { assignee } = req.body;

  if (!assignee?.username || !assignee?.displayName) {
    throw new InvalidValueError('Invalid assignee payload');
  }

  const { username, displayName } = assignee;

  const now = new Date();
  const nowNode = literalDate(now);

  const taskIdNode = ns.data(taskId);
  const userNode = ns.data(username);
  const notExistsFilter = new TriplePattern('?x', ns.ies.isEndOf, '?currentAssignee');

  const results = await ia.select({
    selection: ['?currentAssignee', '?user', '?assigneeName', '?incidentId', '?entryId'],
    clause: [
      ['?currentAssignee', ns.rdf.type, ns.lisa.assignee],
      ['?currentAssignee', ns.ies.isStateOf, taskIdNode],
      ['?currentAssignee', ns.ies.relatesTo, '?user'],
      ['?user', ns.ies.hasName, '?assigneeName'],
      ['?bounding', ns.ies.isStartOf, '?currentAssignee'],
      ['?bounding', ns.ies.inPeriod, '?startDate'],
      ['?entryId', ns.lisa.hasTask, taskIdNode],
      ['?incidentId', ns.lisa.hasLogEntry, '?entryId'],
      `FILTER NOT EXISTS {${notExistsFilter}}`
    ]
  });

  const triples = [];

  // Prevent reassigning same person
  if (
    results.length === 1 &&
    results[0].user?.value === userNode.value
  ) {
    throw new InvalidValueError('New assignee is the same as current assignee');
  }

  // Close current open state(s)
  for (const result of results) {
    const prevStateNode = ns.data(nodeValue(result.currentAssignee.value));
    const closeNode = ns.data(randomUUID());
    triples.push(
      [closeNode, ns.ies.inPeriod, nowNode],
      [closeNode, ns.ies.isEndOf, prevStateNode]
    );
  }

  // Create new assignee state
  const newAssigneeStateNode = ns.data(randomUUID());
  const newBoundingNode = ns.data(randomUUID());

  triples.push(
    // Ensure user has display name
    [userNode, ns.ies.hasName, literalString(displayName)],

    [newAssigneeStateNode, ns.rdf.type, ns.lisa.assignee],
    [newAssigneeStateNode, ns.ies.isStateOf, taskIdNode],
    [newAssigneeStateNode, ns.ies.relatesTo, userNode],

    [newBoundingNode, ns.ies.inPeriod, nowNode],
    [newBoundingNode, ns.ies.isStartOf, newAssigneeStateNode]
  );

  await ia.insertData(triples);

  createNotification({
    recipient: username,
    type: 'TaskAssignedNotification',
    entryId: nodeValue(results[0].entryId.value),
    incidentId: nodeValue(results[0].incidentId.value),
    taskId
  });

  res.status(200).json({ message: 'Assignee changed successfully' });
}
