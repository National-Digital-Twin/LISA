// Local imports
import { type Incident } from 'common/Incident';
import { type Field } from '../Field';
import { type FieldGroup } from '../FieldGroup';
import { type LogEntry } from '../LogEntry';
import { type LogEntryType } from '../LogEntryType';

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
  [key in LogEntryType]: LogEntryTypesDictItem;
};
