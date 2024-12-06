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
