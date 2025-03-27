// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Field } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
import { RiskAssessment } from './RiskAssessment';
import { type LogEntryTypesDictItem } from './types';

const REVIEW_FIELD: Field = {
  id: 'Review',
  label: 'Risk assessment to review',
  type: 'SelectLogEntry',
  linkableTypes: ['RiskAssessment', 'RiskAssessmentReview']
};

function fields(entry: Partial<LogEntry>) {
  const reviewValue = entry.fields?.find((f) => f.id === REVIEW_FIELD.id)?.value;
  if (reviewValue) {
    return [REVIEW_FIELD, ...RiskAssessment.fields(entry)];
  }
  return [REVIEW_FIELD];
}

export const RiskAssessmentReview: LogEntryTypesDictItem = {
  ...RiskAssessment,
  label: 'Risk assessment review',
  dateLabel: 'Date and time reviewed',
  fields,
  groups: [
    { id: 'review', fieldIds: [REVIEW_FIELD.id] },
    ...(RiskAssessment.groups || [])
  ]
};
