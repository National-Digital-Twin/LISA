// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { optional } from 'rdf-sparql-builder';
import TriplePattern from 'rdf-sparql-builder/lib/TriplePattern';

import { TaskStatus } from 'common/Task';
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function tasks(incidentId?: string) {
  const statusNotExistsFilter = new TriplePattern('?x', ns.ies.isEndOf, '?statusNode');
  const assigneeNotExistsFilter = new TriplePattern('?x', ns.ies.isEndOf, '?assigneeNode');

  const taskStatusValues = TaskStatus.alternatives
    .map((literal) => `<${ns.lisa(literal.value).value}>`)
    .join(' ');

  const incidentClauses: unknown[] = [
    ['?incidentId', ns.lisa.hasTask, '?taskId'],
    ...(incidentId ? [`FILTER(?incidentId = <${ns.data(incidentId).value}>)`] : [])
  ];

  return select({
    clause: [
      ...incidentClauses,
      ['?incidentId', ns.ies.hasName, '?incidentName'],
      ['?taskId', ns.ies.hasName, '?taskName'],
      ['?taskId', ns.lisa.hasDescription, '?description'],
      ['?taskId', ns.lisa.hasSequence, '?sequence'],
      ['?taskId', ns.lisa.createdAt, '?createdAt'],

      // Author
      ['?author', ns.ies.isParticipantIn, '?taskId'],
      ['?author', ns.rdf.type, ns.ies.Creator],
      ['?author', ns.ies.hasName, '?authorName'],

      // Latest Status
      optional([
        ['?statusNode', ns.ies.isStateOf, '?taskId'],
        ['?statusNode', ns.rdf.type, '?taskStatus'],
        ['?statusBounding', ns.ies.isStartOf, '?statusNode'],
        ['?statusBounding', ns.ies.inPeriod, '?statusStart'],
        `FILTER NOT EXISTS {${statusNotExistsFilter}}`,
        `VALUES ?taskStatus { ${taskStatusValues} }`
      ]),

      // Latest Assignee
      optional([
        ['?assigneeNode', ns.rdf.type, ns.lisa.assignee],
        ['?assigneeNode', ns.ies.isStateOf, '?taskId'],
        ['?assigneeNode', ns.ies.relatesTo, '?assignee'],
        ['?assignee', ns.ies.hasName, '?assigneeName'],
        ['?assigneeBounding', ns.ies.isStartOf, '?assigneeNode'],
        ['?assigneeBounding', ns.ies.inPeriod, '?assigneeStart'],
        `FILTER NOT EXISTS {${assigneeNotExistsFilter}}`
      ]),


      // Location
      optional([
        ['?taskId', ns.ies.inLocation, '?locationId'],
        optional([
          ['?locationId', ns.ies.Latitude, '?latitude'],
          ['?locationId', ns.ies.Longitude, '?longitude']
        ]),
        optional([
          ['?locationId', ns.lisa.hasDescription, '?locationDescription']
        ])
      ])
    ]
  });
}


