// Global imports
import { optional } from 'rdf-sparql-builder';
import { Request } from 'express';

// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function fields(req: Request, incidentId: string) {
  return select(req, {
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      ['?entryId', ns.lisa.hasField, '?fieldId'],
      ['?fieldId', ns.ies.hasName, '?fieldName'],
      ['?fieldId', ns.ies.hasValue, '?fieldValue'],
      optional([
        ['?fieldId', ns.lisa.hasFieldType, '?fieldType'],
      ])
    ]
  });
}
