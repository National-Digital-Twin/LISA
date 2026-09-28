// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function mentionsUserInLogContent(incidentId: string) {
  return select({
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      ['?mentionsUser', ns.lisa.isMentionedIn, '?entryId']
    ]
  });
}
