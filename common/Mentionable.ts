// Global imports
import { Literal, Record, Static, String, Union } from 'runtypes';

export const MentionableType = Union(
  Literal('User'),
  Literal('LogEntry'),
  Literal('File'),
);

// eslint-disable-next-line no-redeclare
export type MentionableType = Static<typeof MentionableType>;

export const Mentionable = Record({
  id: String,
  label: String,
  type: MentionableType
});

// eslint-disable-next-line no-redeclare
export type Mentionable = Static<typeof Mentionable>;
