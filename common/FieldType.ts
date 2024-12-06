// Global imports
import { Literal, Static, Union } from 'runtypes';

export const FieldType = Union(
  Literal('Select'),
  Literal('SelectMulti'),
  Literal('SelectLogEntry'),
  Literal('YesNo'),
  Literal('Input'),
  Literal('TextArea'),
  Literal('Location'),
  Literal('Date'),
  Literal('DateTime'),
  Literal('Time'),
  Literal('Label')
);

// eslint-disable-next-line no-redeclare
export type FieldType = Static<typeof FieldType>;
