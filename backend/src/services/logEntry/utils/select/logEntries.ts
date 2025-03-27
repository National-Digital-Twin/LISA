// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { optional } from 'rdf-sparql-builder';

// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function logEntries(incidentId: string) {
  return select({
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?id'],
      ['?id', ns.rdf.type, '?type'],
      ['?id', ns.ies.inPeriod, '?dateTime'],
      ['?id', ns.lisa.hasSequence, '?sequence'],
      optional([
        ['?id', ns.lisa.contentText, '?contentText'],
        ['?id', ns.lisa.contentJSON, '?contentJSON'],
      ]),
      optional([
        ['?author', ns.ies.isParticipantIn, '?id'],
        ['?author', ns.ies.hasName, '?authorName'],
      ]),
      optional([
        ['?id', ns.lisa.inStage, '?stage'],
      ]),
      optional([
        ['?id', ns.lisa.createdAt, '?createdAt']
      ]),
      optional([
        ['?id', ns.ies.inLocation, '?locationId'],
        optional([
          ['?locationId', ns.ies.Latitude, '?latitude'],
          ['?locationId', ns.ies.Longitude, '?longitude'],
        ]),
        optional([
          ['?locationId', ns.lisa.hasDescription, '?locationDescription'],
        ])
      ])
    ],
    orderBy: [
      ['?dateTime', 'DESC']
    ]
  });
}
