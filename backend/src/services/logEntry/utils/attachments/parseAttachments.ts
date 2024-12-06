// Local imports
import { LogEntryAttachmentType, type LogEntryAttachment } from 'common/LogEntryAttachment';
import { type ResultRow } from '../../../../ia';
import { nodeValue } from '../../../../rdfutil';

export function parseAttachments(results: ResultRow[]) {
  return results.reduce((map, result) => {
    const entryId = nodeValue(result.entryId.value);
    const attachment: LogEntryAttachment = {
      type: result.attachmentType.value as LogEntryAttachmentType,
      name: result.attachmentName.value,
      key: result.attachmentKey.value,
      mimeType: result.attachmentMimeType.value,
      size: Number(result.attachmentSize.value)
    };
    const attachments = map[entryId] || [];
    attachments.push(attachment);
    return { ...map, [entryId]: attachments };
  }, new Map<string, LogEntryAttachment[]>());
}
