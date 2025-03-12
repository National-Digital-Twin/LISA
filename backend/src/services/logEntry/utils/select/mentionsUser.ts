// Global imports
import { Request } from 'express';

// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function mentionsUser(req : Request, incidentId: string) {
  return select(req, {
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      ['?mentionsUser', ns.lisa.isMentionedIn, '?entryId']
    ]
  });
}
