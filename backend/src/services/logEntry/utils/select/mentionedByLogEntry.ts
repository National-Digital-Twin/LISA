// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function mentionedByLogEntry(incidentId: string) {
  return select({
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      ['?entryId', ns.lisa.isMentionedBy, '?mentionedByLogEntry']
    ]
  });
}
