// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Incident } from 'common/Incident';
import { type Field } from '../Field';
import { type FieldGroup } from '../FieldGroup';
import { type LogEntry } from '../LogEntry';
import { type LogEntryTypeV2 } from '../LogEntryType';

export type LogEntryTypesDictItem = {
  label: string;
  colour?: string;
  fields: (entry: Partial<LogEntry>) => Array<Field>;
  groups?: Array<FieldGroup>;
  noContent?: boolean;
  dateLabel?: string;
  descriptionLabel?: string;
  requireLocation?: boolean;
  stage?: boolean;
  description?: string;
  unselectable?: (incident?: Partial<Incident>) => boolean;
};

export type LogEntryTypesDict = {
  [key in LogEntryTypeV2]: LogEntryTypesDictItem;
};
