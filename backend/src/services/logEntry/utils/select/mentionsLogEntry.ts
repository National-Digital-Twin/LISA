// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function mentionsLogEntry(incidentId: string) {
  return select({
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      ['?mentionsLogEntry', ns.lisa.isMentionedBy, '?entryId']
    ]
  });
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
