// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Union, Literal, Static, Record, Number, String, Optional } from 'runtypes';

export const AttachmentType = Union(
  Literal('Recording'),
  Literal('Sketch'),
  Literal('File')
);

export type AttachmentType = Static<typeof AttachmentType>;

export const Attachment = Record({
  name: String,
  type: AttachmentType,
  key: Optional(String),
  size: Optional(Number),
  mimeType: Optional(String),
  scanResult: Optional(String)
});

export type Attachment = Static<typeof Attachment>;

// Keep old exports for backward compatibility during transition
export const LogEntryAttachmentType = AttachmentType;
export type LogEntryAttachmentType = AttachmentType;
export const LogEntryAttachment = Attachment;
export type LogEntryAttachment = Attachment;
