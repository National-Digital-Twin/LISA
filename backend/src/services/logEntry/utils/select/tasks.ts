// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { optional } from 'rdf-sparql-builder';
import TriplePattern from 'rdf-sparql-builder/lib/TriplePattern';

// Local imports
import { TaskStatus } from 'common/Task';
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function tasks(incidentId: string) {
  const statusNotExistsFilter = new TriplePattern('?x', ns.ies.isEndOf, '?statusNode');
  const assigneeNotExistsFilter = new TriplePattern('?x', ns.ies.isEndOf, '?assigneeNode');

  const taskStatusValues = TaskStatus.alternatives.map((literal) => literal.value);
  const allowedStatusTypes = taskStatusValues.map((s) => `<${ns.lisa(s).value}>`).join(', ');

  return select({
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      ['?entryId', ns.lisa.hasTask, '?taskId'],
      ['?taskId', ns.ies.hasName, '?taskName'],
      optional([
        ['?taskId', ns.lisa.hasDescription, '?description'],
      ]),

      // Latest Status
      optional([
        ['?statusNode', ns.ies.isStateOf, '?taskId'],
        ['?statusNode', ns.rdf.type, '?taskStatus'],
        ['?statusBounding', ns.ies.isStartOf, '?statusNode'],
        ['?statusBounding', ns.ies.inPeriod, '?statusStart'],
        `FILTER NOT EXISTS {${statusNotExistsFilter}}`,
        `FILTER(?taskStatus IN (${allowedStatusTypes}))`
      ]),

      // Latest Assignee
      optional([
        ['?assigneeNode', ns.rdf.type, ns.lisa.assignee],
        ['?assigneeNode', ns.ies.isStateOf, '?taskId'],
        ['?assigneeNode', ns.ies.relatesTo, '?user'],
        ['?user', ns.ies.hasName, '?assigneeName'],
        ['?assigneeBounding', ns.ies.isStartOf, '?assigneeNode'],
        ['?assigneeBounding', ns.ies.inPeriod, '?assigneeStart'],
        `FILTER NOT EXISTS {${assigneeNotExistsFilter}}`
      ])
    ]
  });
}
