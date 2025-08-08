// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import TriplePattern from 'rdf-sparql-builder/lib/TriplePattern';
import { create as createNotification } from '../notifications';
import { InvalidValueError } from '../../errors';
import { literalDate, literalString, nodeValue, ns } from '../../rdfutil';
import * as ia from '../../ia';

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
    selection: ['?currentAssignee', '?user', '?assigneeName', '?incidentId'],
    clause: [
      ['?currentAssignee', ns.rdf.type, ns.lisa.assignee],
      ['?currentAssignee', ns.ies.isStateOf, taskIdNode],
      ['?currentAssignee', ns.ies.relatesTo, '?user'],
      ['?user', ns.ies.hasName, '?assigneeName'],
      ['?bounding', ns.ies.isStartOf, '?currentAssignee'],
      ['?bounding', ns.ies.inPeriod, '?startDate'],
      ['?incidentId', ns.lisa.hasTask, taskIdNode],
      `FILTER NOT EXISTS {${notExistsFilter}}`
    ]
  });

  const triples = [];

  // Prevent reassigning same person
  if (results.length === 1 && results[0].user?.value === userNode.value) {
    throw new InvalidValueError('New assignee is the same as current assignee');
  }

  // Close current open state(s)
  for (const result of results) {
    const prevStateNode = ns.data(nodeValue(result.currentAssignee.value));
    const closeNode = ns.data(randomUUID());
    triples.push([closeNode, ns.ies.inPeriod, nowNode], [closeNode, ns.ies.isEndOf, prevStateNode]);
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
    incidentId: nodeValue(results[0].incidentId.value),
    taskId
  });

  res.status(200).json({ message: 'Assignee changed successfully' });
}
