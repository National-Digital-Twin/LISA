// Global imports
import { Request } from 'express';

// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function mentionedByLogEntry(req: Request, incidentId: string) {
  return select(req, {
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      ['?entryId', ns.lisa.isMentionedBy, '?mentionedByLogEntry']
    ]
  });
}
