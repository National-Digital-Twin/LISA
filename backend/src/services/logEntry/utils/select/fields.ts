// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { optional } from 'rdf-sparql-builder';

// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function fields(incidentId: string) {
  return select({
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
