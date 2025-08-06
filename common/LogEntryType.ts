// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
  Literal('SetIncidentInformation'),
  Literal('ChangeTaskAssignee'),
  Literal('ChangeTaskStatus'),
  Literal('FormSubmitted')
);

export const LogEntryTypeV2 = Union(
  Literal('action'),
  Literal('avianFlu'),
  Literal('communication'),
  Literal('decision'),
  Literal('general'),
  Literal('hotDebrief'),
  // Literal('Casualty'),
  // Literal('Debrief'),
  Literal('riskAssessment'),
  Literal('riskAssessmentReview'),
  Literal('situationReport'),
  Literal('shiftHandover'),
  Literal('changeStage'),
  Literal('setIncidentInformation'),
  Literal('changeTaskAssignee'),
  Literal('changeTaskStatus'),
  Literal('formSubmitted')
);

export type LogEntryType = Static<typeof LogEntryType>;
export type LogEntryTypeV2 = Static<typeof LogEntryTypeV2>;
