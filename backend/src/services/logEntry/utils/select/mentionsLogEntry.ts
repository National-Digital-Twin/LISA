// Global imports
import { Request } from 'express';

// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function mentionsLogEntry(req: Request, incidentId: string) {
  return select(req, {
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      ['?mentionsLogEntry', ns.lisa.isMentionedBy, '?entryId']
    ]
  });
}
