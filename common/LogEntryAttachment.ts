// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Union, Literal, Static, Object, Number, String } from 'runtypes';

export const LogEntryAttachmentType = Union(
  Literal('Recording'),
  Literal('Sketch'),
  Literal('File')
);

export type LogEntryAttachmentType = Static<typeof LogEntryAttachmentType>;

export const LogEntryAttachment = Object({
  name: String,
  type: LogEntryAttachmentType,
  key: String.optional(),
  size: Number.optional(),
  mimeType: String.optional(),
  scanResult: String.optional()
});

export type LogEntryAttachment = Static<typeof LogEntryAttachment>;
