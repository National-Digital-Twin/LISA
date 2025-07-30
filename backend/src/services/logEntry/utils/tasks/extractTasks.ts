// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { randomUUID } from 'crypto';
import { LogEntry } from 'common/LogEntry';
import { literalDate, literalString, ns } from '../../../../rdfutil';

export function extractTasks(
  entry: LogEntry,
  entryIdNode: unknown,
  taskNode: unknown
): Array<unknown> {
  if (!entry.task) return [];

  const triples: unknown[] = [];
  const now = new Date();
  const nowNode = literalDate(now);

  // Nodes
  const taskUserNode = ns.data(entry.task.assignee.username); // stable user
  const assigneeStateNode = ns.data(randomUUID());
  const assigneeBoundingNode = ns.data(randomUUID());
  const statusStateNode = ns.data(randomUUID());
  const statusBoundingNode = ns.data(randomUUID());

  // Insert task data
  triples.push(
    [entryIdNode, ns.lisa.hasTask, taskNode],
    [taskNode, ns.ies.hasName, literalString(entry.task.name)],
    [taskNode, ns.lisa.hasDescription, literalString(entry.task.description ?? '')],

    // Insert user info (stable)
    [taskUserNode, ns.ies.hasName, literalString(entry.task.assignee.displayName)],

    // Insert Assignee State
    [assigneeStateNode, ns.rdf.type, ns.lisa.assignee],
    [assigneeStateNode, ns.ies.isStateOf, taskNode],
    [assigneeStateNode, ns.ies.relatesTo, taskUserNode],
    [assigneeBoundingNode, ns.ies.inPeriod, nowNode],
    [assigneeBoundingNode, ns.ies.isStartOf, assigneeStateNode],

    // Insert Status State
    [statusStateNode, ns.rdf.type, ns.lisa(entry.task.status)],
    [statusStateNode, ns.ies.isStateOf, taskNode],
    [statusBoundingNode, ns.ies.inPeriod, nowNode],
    [statusBoundingNode, ns.ies.isStartOf, statusStateNode]
  );

  return triples;
}
