// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { randomUUID } from 'crypto';
import { Express, Request } from 'express';
import fs from 'fs';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { Node } from 'rdflib';
import { FileNameMapping } from '../types';
import { literalInteger, literalString, nodeValue, ns } from '../../../../rdfutil';
import { storeS3Object } from '../../../fileStorage';

export async function extractAttachments(
  req: Request,
  entry: LogEntry,
  entryIdNode: unknown
): Promise<{ triples: unknown[]; names: FileNameMapping[]}> {
  if (!entry.attachments?.length || !req.files?.length) {
    return { triples: [], names: [] };
  }

  const entryId = nodeValue((entryIdNode as Node).value);
  const files = req.files as Express.Multer.File[];
  const triples: unknown[] = [];
  const nameMaps: FileNameMapping[] = [];

  try {
    const timeStamp = new Date().toISOString().substring(0, 19).replace('T', ' at ');

    for await (const attachment of entry.attachments) {
      const uploadedFile = files.find((file) => file.originalname === attachment.name);
      if (uploadedFile) {
        const attachmentId = randomUUID();
        const key = await storeS3Object(`${entryId}:${attachmentId}`, uploadedFile.path);

        const { originalname } = uploadedFile;
        const extension = originalname.split('.').pop();
        const name = originalname.substring(0, (originalname.length - extension.length) - 1);
        const fileName = `${name} ${timeStamp}.${extension}`;

        nameMaps.push({
          originalname,
          storedName: fileName
        });

        const attachmentIdNode = ns.data(attachmentId);
        triples.push([attachmentIdNode, ns.rdf.type, ns.ies.MediaFile]);
        triples.push([attachmentIdNode, ns.ies.hasName, literalString(fileName)]);
        triples.push([attachmentIdNode, ns.ies.hasKey, literalString(key)]);
        triples.push([attachmentIdNode, ns.lisa.hasSize, literalInteger(uploadedFile.size)]);
        triples.push([attachmentIdNode, ns.lisa.hasMimeType, literalString(uploadedFile.mimetype)]);
        triples.push([attachmentIdNode, ns.lisa.hasAttachmentType, literalString(attachment.type)]);

        triples.push([entryIdNode, ns.lisa.hasAttachment, attachmentIdNode]);
      }
    }
  } catch (err) {
    // need a strategy for dealing with possible orphaned files in S3
    throw new Error('error with attachments', err);
  } finally {
    files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (!err) {
          return;
        }
        console.warn('could not delete temporary file', err);
      });
    });
  }

  return { triples, names: nameMaps };
}
