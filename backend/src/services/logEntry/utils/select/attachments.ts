// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function attachments(incidentId: string) {
  return select({
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
