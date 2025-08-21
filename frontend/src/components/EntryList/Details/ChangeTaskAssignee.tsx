// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type LogEntry } from 'common/LogEntry';
import { InfoItem, TaskLink } from './TaskLogParts';

interface Props {
  entry: LogEntry;
}
export default function ChangeTaskAssignee({ entry }: Readonly<Props>) {
  const newAssignee = entry.details?.changedAssignee;
  if (!newAssignee) {
    return null;
  }

  const taskName = entry.details?.changedTaskName;
  const taskId = entry.details?.changedTaskId;

  return (
    <>
      <InfoItem label="Task name:">
        <TaskLink taskId={taskId}>{taskName}</TaskLink>
      </InfoItem>

      <InfoItem label="Assignee changed to:">
        {newAssignee}
      </InfoItem>
    </>
  );
}
