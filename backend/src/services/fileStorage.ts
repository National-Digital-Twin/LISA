// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import Stream from 'node:stream';

import fs from 'node:fs';
import { Request, Response } from 'express';
import {
  GetObjectCommand,
  GetObjectTaggingCommand,
  GetObjectTaggingCommandOutput,
  PutObjectCommand,
  S3Client,
  S3ServiceException
} from '@aws-sdk/client-s3';
import { settings } from '../settings';
import { ApplicationError } from '../errors';

const browserEnabledTypes = ['image/', 'application/pdf', 'audio/mpeg'];

function getContentInfo(
  fileName: string,
  mimeType: string
): { disposition: string; type?: string } {
  let canOpenInBrowser = false;
  for (const allowedType of browserEnabledTypes) {
    if (mimeType.startsWith(allowedType)) {
      canOpenInBrowser = true;
      break;
    }
  }
  return {
    disposition: canOpenInBrowser ? 'inline' : `attachment; filename*="${fileName}"`,
    type: canOpenInBrowser ? mimeType : undefined
  };
}

function createS3Client(): S3Client {
  if (settings.S3_ENDPOINT) { // MinIO
    return new S3Client({
      endpoint: settings.S3_ENDPOINT,
      forcePathStyle: true,
      region: 'eu-west-2',
      credentials: settings.S3_ACCESS_KEY_ID ? {
        accessKeyId: settings.S3_ACCESS_KEY_ID,
        secretAccessKey: settings.S3_SECRET_ACCESS_KEY
      } : undefined
    });
  }

  return new S3Client();
}

export async function getScanResultInternal(key: string) {
  if (!key) {
    throw new ApplicationError('Key cannot be undefined.');
  }

  const client = createS3Client();

  const command = new GetObjectTaggingCommand({
    Bucket: settings.S3_BUCKET_ID,
    Key: key
  });

  let response: GetObjectTaggingCommandOutput;

  try {
    response = await client.send(command);
  } catch (error) {
    console.log(error);
    return 'PENDING';
  }

  if (response.TagSet) {
    return (
      response.TagSet.find((tag) => tag.Key === 'GuardDutyMalwareScanStatus')?.Value ?? 'PENDING'
    );
  }
  return 'PENDING';
}

export async function getScanResultExternal(req: Request, res: Response) {
  const { key } = req.params;

  try {
    return await getScanResultInternal(key);
  } catch (e) {
    if (e instanceof S3ServiceException) {
      if (e.$response.statusCode === 304) {
        const headers = e.$response.headers;
        res.set({
          'Last-Modified': headers['last-modified'],
          ETag: headers.etag
        });
        return res.status(304).end();
      }
    }
    throw e;
  }
}

export async function streamS3Object(req: Request, res: Response) {
  const { key, fileName } = req.params;
  const { mimeType } = req.query;
  if (!mimeType) {
    res.status(400).send('missing mimeType query param');
    return;
  }

  const scanResult = await getScanResultInternal(key);

  if (scanResult && scanResult !== 'NO_THREATS_FOUND') {
    res.status(400).send('The requested file has been found to be malicious.');
    return;
  }

  const { disposition, type } = getContentInfo(fileName, String(mimeType));
  const client = createS3Client();
  const ims = req.header('If-Modified-Since');
  const command = new GetObjectCommand({
    Bucket: settings.S3_BUCKET_ID,
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
      ETag: fileResponse.ETag
    });
    const stream = fileResponse.Body as Stream;
    stream.pipe(res);
  } catch (e) {
    if (e instanceof S3ServiceException) {
      if (e.$response.statusCode === 304) {
        const headers = e.$response.headers;
        res.set({
          'Last-Modified': headers['last-modified'],
          ETag: headers.etag
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

  const client = createS3Client();
  const command = new PutObjectCommand({
    Bucket: settings.S3_BUCKET_ID,
    Key: key,
    Body: fileReadStream
  });

  try {
    await client.send(command);
  } catch (e) {
    console.log(e);
    throw new Error('error storing file', e);
  }

  return key;
}
