// Local imports
import { LogEntryAttachmentType, type LogEntryAttachment } from 'common/LogEntryAttachment';
import { type ResultRow } from '../../../../ia';
import { nodeValue } from '../../../../rdfutil';
import { getScanResultInternal } from '../../../fileStorage';

export async function parseAttachments(results: ResultRow[]) {
  return results.reduce(async (map, result) => {
    const entryId = nodeValue(result.entryId.value);
    const attachment: LogEntryAttachment = {
      type: result.attachmentType.value as LogEntryAttachmentType,
      name: result.attachmentName.value,
      key: result.attachmentKey.value,
      mimeType: result.attachmentMimeType.value,
      size: Number(result.attachmentSize.value),
      scanResult: await getScanResultInternal(result.attachmentKey.value)
    };
    const resolvedMap = await map;
    const attachments = resolvedMap[entryId] || [];
    attachments.push(attachment);
    return { ...resolvedMap, [entryId]: attachments };
  }, Promise.resolve(new Map<string, LogEntryAttachment[]>()));
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
