// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Static, Object, String } from 'runtypes';
import { TaskStatus } from './Task';

export const LogEntryChangeDetails = Object({
  changedAssignee: String.optional(), // Only applicable to type ChangeTaskAssignee
  changedStatus: TaskStatus.optional(), // Only applicable to type ChangeTaskStatus
  changedTaskName: String.optional(), // Only applicable to type ChangeTaskStatus/ChangeTaskAssignee
  changedTaskId: String.optional(), // Only applicable to type ChangeTaskStatus/ChangeTaskAssignee
  submittedFormId: String.optional(), // Only applicable to type FormSubmitted
  submittedFormTitle: String.optional() // Only applicable to type FormSubmitted
});

export type LogEntryChangeDetails = Static<typeof LogEntryChangeDetails>;
