// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function mentionsUser(incidentId: string) {
  return select({
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      ['?mentionsUser', ns.lisa.isMentionedIn, '?entryId']
    ]
  });
}
