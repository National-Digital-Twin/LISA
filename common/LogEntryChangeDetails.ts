// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Static, Record, String, Optional } from 'runtypes';
import { TaskStatus } from './Task';

export const LogEntryChangeDetails = Record({
  changedAssignee: Optional(String), // Only applicable to type ChangeTaskAssignee
  changedStatus: Optional(TaskStatus), // Only applicable to type ChangeTaskStatus
  changedTaskName: Optional(String), // Only applicable to type ChangeTaskStatus/ChangeTaskAssignee
  changedTaskId: Optional(String), // Only applicable to type ChangeTaskStatus/ChangeTaskAssignee
  submittedFormId: Optional(String), // Only applicable to type FormSubmitted
  submittedFormTemplateId: Optional(String), // Only applicable to type FormSubmitted
  submittedFormTitle: Optional(String) // Only applicable to type FormSubmitted
});

export type LogEntryChangeDetails = Static<typeof LogEntryChangeDetails>;
