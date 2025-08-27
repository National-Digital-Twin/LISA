// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type LogEntry } from 'common/LogEntry';
import { InfoItem, TaskLink } from './TaskLogParts';

interface Props {
  entry: LogEntry;
}
export default function TaskCreated({ entry }: Readonly<Props>) {
  if (!entry.details) {
    return null;
  }

  const { createdTaskName: taskName, createdTaskId: taskId, changedAssignee: assignee } = entry.details;

  return (
    <>
      <InfoItem label="Task name:">
        <TaskLink taskId={taskId}>{taskName}</TaskLink>
      </InfoItem>

      <InfoItem label="Assigned to:">
        {assignee ?? '—'}
      </InfoItem>
    </>
  );
}
