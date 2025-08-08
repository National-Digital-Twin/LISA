// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { randomUUID } from 'crypto';
import { TaskStatus } from 'common/Task';
import { Request, Response } from 'express';
import TriplePattern from 'rdf-sparql-builder/lib/TriplePattern';
import { ApplicationError, InvalidValueError } from '../../errors';
import { literalDate, nodeValue, ns } from '../../rdfutil';
import * as ia from '../../ia';

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

  const taskStatusValues = TaskStatus.alternatives
    .map((literal) => `<${ns.lisa(literal.value).value}>`)
    .join(' ');

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
      `VALUES ?statusType { ${taskStatusValues} }`
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

  res.status(200).json({ message: 'Status changed successfully' });
}
