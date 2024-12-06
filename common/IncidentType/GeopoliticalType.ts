// Global imports
import { Literal, Static, Union } from 'runtypes';

export const GeopoliticalType = Union(
  Literal('OilTradeDisruption')
);

// eslint-disable-next-line no-redeclare
export type GeopoliticalType = Static<typeof GeopoliticalType>;
