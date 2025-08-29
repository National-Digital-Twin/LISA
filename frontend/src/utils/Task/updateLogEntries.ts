// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { v4 as uuidV4 } from 'uuid';
import { TaskStatus } from 'common/Task';
import { LogEntry } from 'common/LogEntry';
import { createSequenceNumber } from '../Form/sequence';

export function createLogEntryFromTaskStatusUpdate(
  taskId: string,
  status: TaskStatus,
  incidentId: string,
  entry?: Partial<LogEntry>
): Partial<LogEntry> {
  const logEntry: Partial<LogEntry> = entry ?? {
    id: uuidV4(),
    type: 'ChangeTaskStatus',
    incidentId,
    dateTime: new Date().toISOString(),
    content: {},
    fields: [],
    sequence: createSequenceNumber(),
    details: {
      changedStatus: status,
      changedTaskId: taskId
    }
  };

  return logEntry;
}

export function createLogEntryFromTaskAssigneeUpdate(
  taskId: string,
  assigneeName: string,
  incidentId: string,
  entry?: Partial<LogEntry>
): Partial<LogEntry> {
  const logEntry: Partial<LogEntry> = entry ?? {
    id: uuidV4(),
    type: 'ChangeTaskAssignee',
    incidentId,
    dateTime: new Date().toISOString(),
    content: {},
    fields: [],
    sequence: createSequenceNumber(),
    details: {
      changedAssignee: assigneeName,
      changedTaskId: taskId
    }
  };

  return logEntry;
}

export function createLogEntryFromTaskCreation(
  taskId: string,
  taskName: string,
  assignee: string,
  incidentId: string,
  entry?: Partial<LogEntry>
): Partial<LogEntry> {
  const logEntry: Partial<LogEntry> = entry ?? {
    id: uuidV4(),
    type: 'TaskCreated',
    incidentId,
    dateTime: new Date().toISOString(),
    content: {},
    fields: [],
    sequence: createSequenceNumber(),
    details: {
      createdTaskId: taskId,
      createdTaskName: taskName,
      changedAssignee: assignee
    }
  };

  return logEntry;
}
