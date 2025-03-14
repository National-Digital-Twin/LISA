import { Union, Literal, Static, Record, Number, String, Optional } from 'runtypes';

export const LogEntryAttachmentType = Union(
  Literal('Recording'),
  Literal('Sketch'),
  Literal('File')
);

// eslint-disable-next-line no-redeclare
export type LogEntryAttachmentType = Static<typeof LogEntryAttachmentType>;

export const LogEntryAttachment = Record({
  name: String,
  type: LogEntryAttachmentType,
  key: Optional(String),
  size: Optional(Number),
  mimeType: Optional(String),
  scanResult: Optional(String)
});

// eslint-disable-next-line no-redeclare
export type LogEntryAttachment = Static<typeof LogEntryAttachment>;
