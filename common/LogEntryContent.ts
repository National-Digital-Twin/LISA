// Global imports
import { Optional, Record, Static, String } from 'runtypes';

export const LogEntryContent = Record({
  json: Optional(String),
  text: Optional(String)
});

// eslint-disable-next-line no-redeclare
export type LogEntryContent = Static<typeof LogEntryContent>;
