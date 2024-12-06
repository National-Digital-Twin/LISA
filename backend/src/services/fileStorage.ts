import Stream from 'node:stream';

import fs from 'fs';
import { Request, Response } from 'express';
import { GetObjectCommand, PutObjectCommand, S3Client, S3ServiceException } from '@aws-sdk/client-s3';
import { env } from '../settings';

const browserEnabledTypes = [
  'image/',
  'application/pdf',
  'audio/webm'
];

function getContentInfo(fileName: string, mimeType: string): { disposition: string; type?: string; } {
  let canOpenInBrowser = false;
  for (const allowedType of browserEnabledTypes) {
    if (mimeType.startsWith(allowedType)) {
      canOpenInBrowser = true;
      break;
    }
  }
  return {
    disposition: canOpenInBrowser ? 'inline' : `attachment; filename*="${fileName}"`,
    type: canOpenInBrowser ? mimeType : undefined,
  };
}

export async function streamS3Object(req: Request, res: Response) {
  const { key, fileName } = req.params;
  const { mimeType } = req.query;
  if (!mimeType) {
    res.status(400).send('missing mimeType query param');
    return;
  }
  const { disposition, type } = getContentInfo(fileName, String(mimeType));
  const client = new S3Client();
  const ims = req.header('If-Modified-Since');
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_ID,
    Key: key,
    IfNoneMatch: req.header('If-None-Match'),
    IfModifiedSince: ims ? new Date(ims) : undefined
  });

  try {
    const fileResponse = await client.send(command);
    res.set({
      'Content-Length': fileResponse.ContentLength,
      'Content-Type': type || fileResponse.ContentType,
      'Last-Modified': fileResponse.LastModified,
      'Content-Disposition': disposition,
      ETag: fileResponse.ETag,
    });
    const stream = fileResponse.Body as Stream;
    stream.pipe(res);
  } catch (e) {
    if (e instanceof S3ServiceException) {
      if (e.$response.statusCode === 304) {
        const headers = e.$response.headers;
        res.set({
          'Last-Modified': headers['last-modified'],
          ETag: headers.etag,
        });
        res.status(304).end();
        return;
      }
    }
    throw e;
  }
}

export async function storeS3Object(key: string, filePath: string): Promise<string> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`no file found at ${filePath}`);
  }

  let fileReadStream: fs.ReadStream;

  try {
    fileReadStream = fs.createReadStream(filePath);
  } catch (e) {
    throw new Error('error creating file stream', e);
  }

  const client = new S3Client();
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_ID,
    Key: key,
    Body: fileReadStream
  });

  try {
    await client.send(command);
  } catch (e) {
    throw new Error('error storing file', e);
  }

  return key;
}
