// Global imports
import { optional } from 'rdf-sparql-builder';
import { Request } from 'express';

// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function logEntries(req: Request, incidentId: string) {
  return select(req, {
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?id'],
      ['?id', ns.rdf.type, '?type'],
      ['?id', ns.ies.inPeriod, '?dateTime'],
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
