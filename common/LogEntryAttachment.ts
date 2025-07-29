// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Union, Literal, Static, Record, Number, String, Optional } from 'runtypes';

export const LogEntryAttachmentType = Union(
  Literal('Recording'),
  Literal('Sketch'),
  Literal('File')
);

export type LogEntryAttachmentType = Static<typeof LogEntryAttachmentType>;

export const LogEntryAttachment = Record({
  name: String,
  type: LogEntryAttachmentType,
  key: Optional(String),
  size: Optional(Number),
  mimeType: Optional(String),
  scanResult: Optional(String)
});

export type LogEntryAttachment = Static<typeof LogEntryAttachment>;
