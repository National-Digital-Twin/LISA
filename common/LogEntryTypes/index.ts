// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imoprts
import { Action } from './Action';
import { AvianFlu } from './AvianFlu';
import { Communication } from './Communication';
import { ChangeStage } from './ChangeStage';
import { Decision } from './Decision';
import { General } from './General';
import { HotDebrief } from './HotDebrief';
import { RiskAssessment } from './RiskAssessment';
import { RiskAssessmentReview } from './RiskAssessmentReview';
import { SituationReport } from './SituationReport';
import { ShiftHandover } from './ShiftHandover';
import { LogEntryTypesDict } from './types';
import { SetIncidentInformation } from './SetIncidentInformation';
import { ChangeTaskStatus } from './ChangeTaskStatus';
import { ChangeTaskAssignee } from './ChangeTaskAssignee';
import { FormSubmitted } from './FormSubmitted';

export const LogEntryTypes: LogEntryTypesDict = {
  AvianFlu,
  Action,
  Communication,
  Decision,
  General,
  HotDebrief,
  // Casualty: { label: 'Casualty', colour: 'red' },
  // Debrief: { label: 'Debrief', colour: 'light-grey' },
  RiskAssessment,
  RiskAssessmentReview,
  ShiftHandover,
  SituationReport,
  ChangeStage,
  SetIncidentInformation,
  ChangeTaskStatus,
  ChangeTaskAssignee,
  FormSubmitted
};
