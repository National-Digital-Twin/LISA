// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { LogEntry } from "common/LogEntry";
import { literalString, ns } from "../../../../rdfutil";

export function extractDetails(entry: LogEntry, entryIdNode: unknown): Array<unknown> {
  if (!entry.details) return [];

  const triples: unknown[] = [];
  
  if(entry.details.changedTaskId) {
    triples.push([entryIdNode, ns.lisa.hasModifiedTask, ns.data(entry.details.changedTaskId)])
  }

  if(entry.details.changedStatus) {
    triples.push([entryIdNode, ns.lisa.hasStatus, literalString(entry.details.changedStatus)])
  }

  if(entry.details.changedAssignee) {
    triples.push([entryIdNode, ns.lisa.assignee, literalString(entry.details.changedAssignee)])
  }

  return triples;
}