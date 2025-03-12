// Global imports
import { Request } from 'express';

// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function attachments(req: Request, incidentId: string) {
  return select(req, {
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      ['?entryId', ns.lisa.hasAttachment, '?attachmentId'],
      ['?attachmentId', ns.ies.hasName, '?attachmentName'],
      ['?attachmentId', ns.ies.hasKey, '?attachmentKey'],
      ['?attachmentId', ns.lisa.hasSize, '?attachmentSize'],
      ['?attachmentId', ns.lisa.hasMimeType, '?attachmentMimeType'],
      ['?attachmentId', ns.lisa.hasAttachmentType, '?attachmentType'],
    ]
  });
}
