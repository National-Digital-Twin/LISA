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
  SetIncidentInformation
};
