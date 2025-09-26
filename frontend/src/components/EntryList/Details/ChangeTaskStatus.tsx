// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type LogEntry } from 'common/LogEntry';
 
import { TaskStatus } from 'common/Task';
import { Box, Typography } from '@mui/material';
import { toStatusHumanReadable } from '../../Tasks/utils/statusLabelMapper';
import StatusMini from '../../Tasks/StatusMini';
import { InfoItem, TaskLink } from './TaskLogParts';

interface Props {
  entry: LogEntry;
}

export default function ChangeTaskStatus({ entry }: Readonly<Props>) {
  const statusCheck = TaskStatus.guard(entry.details?.changedStatus);
  if (!statusCheck) {
    return null;
  }

  const changedStatus = entry.details?.changedStatus as TaskStatus;
  const taskName = entry.details?.changedTaskName;
  const taskId = entry.details?.changedTaskId;

  return (
    <>
      <InfoItem label="Task name:">
        <TaskLink taskId={taskId}>{taskName}</TaskLink>
      </InfoItem>

      <InfoItem label="Status changed to:">
        <Box display="flex" alignItems="center" gap={1} flexWrap="nowrap">
          <Box sx={{ display: 'inline-flex', alignItems: 'center', transform: 'translateY(-1px)' }}>
            <StatusMini status={changedStatus} />
          </Box>
          <Typography component="span" variant="body1" noWrap sx={{ lineHeight: 1, m: 0 }}>
            {toStatusHumanReadable(changedStatus)}
          </Typography>
        </Box>
      </InfoItem>
    </>
  );
}


