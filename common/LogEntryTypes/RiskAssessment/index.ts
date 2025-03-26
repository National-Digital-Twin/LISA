// Local imports
import { type Field } from '../../Field';
import { type FieldGroup } from '../../FieldGroup';
import { type LogEntry } from '../../LogEntry';
import { type LogEntryTypesDictItem } from '../types';
import { getFieldIds } from '../utils';
import { getHazardFields, getHazardGroups, getRelevantHazards } from './hazards';

const InitialFields: Field[] = [
  { id: 'Location', label: 'Location', type: 'Location' },
  getRelevantHazards()
];
const OtherFields: Field[] = [
  { id: 'Comments', label: 'Any other comments', type: 'TextArea', optional: true, className: 'full-width' }
];

const GROUPS: Array<FieldGroup> = [
  { id: 'initial', fieldIds: getFieldIds(InitialFields) },
  ...getHazardGroups(),
  { id: 'other', fieldIds: getFieldIds(OtherFields) }
];

function fields(entry: Partial<LogEntry>): Array<Field> {
  return [
    ...InitialFields,
    ...getHazardFields(entry),
    ...OtherFields
  ].filter((f) => !!f) as Array<Field>;
}

export const RiskAssessment: LogEntryTypesDictItem = {
  label: 'Risk assessment',
  fields,
  groups: GROUPS,
  noContent: true,
  dateLabel: 'Date and time completed',
  requireLocation: true
};

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
