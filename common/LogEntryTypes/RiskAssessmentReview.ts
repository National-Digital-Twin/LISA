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
