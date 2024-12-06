// Global imports
import { Literal, Static, Union } from 'runtypes';

export const LogEntryType = Union(
  Literal('Action'),
  Literal('AvianFlu'),
  Literal('Communication'),
  Literal('Decision'),
  Literal('General'),
  Literal('HotDebrief'),
  // Literal('Casualty'),
  // Literal('Debrief'),
  Literal('RiskAssessment'),
  Literal('RiskAssessmentReview'),
  Literal('SituationReport'),
  Literal('ShiftHandover'),
  Literal('ChangeStage'),
  Literal('SetIncidentInformation')
);

// eslint-disable-next-line no-redeclare
export type LogEntryType = Static<typeof LogEntryType>;
