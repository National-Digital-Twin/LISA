// Global imports
import { Array, Boolean, Optional, Record, Static, String } from 'runtypes';

export const FieldGroup = Record({
  id: String,
  label: Optional(String),
  description: Optional(String),
  fieldIds: Array(String),
  defaultOpen: Optional(Boolean),
  className: Optional(String)
});

// eslint-disable-next-line no-redeclare
export type FieldGroup = Static<typeof FieldGroup>;
