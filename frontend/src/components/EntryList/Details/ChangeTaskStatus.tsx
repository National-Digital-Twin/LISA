// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type LogEntry } from 'common/LogEntry';
 
import { TaskStatus } from 'common/Task';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { toStatusHumanReadable } from '../../Tasks/utils/statusLabelMapper';
import StatusMini from '../../Tasks/StatusMini';

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
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={0.5}
        sx={{ width: '100%', mb: 2 }}
      >
        <Typography variant="body1" fontWeight="bold">
          Task name:
        </Typography>
        <Typography component={Link} to={`/tasks/${taskId}`} color="primary" fontWeight="bold">
          {taskName}
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={0.5}
        sx={{ width: '100%' }}
      >
        <Typography variant="body1" fontWeight="bold" mb={0.5}>
        Status changed to:
        </Typography>
        <Box display="flex" alignItems="center" gap={1} flexWrap="nowrap">
          <Box sx={{ display: 'inline-flex', alignItems: 'center', transform: 'translateY(-1px)' }}>
            <StatusMini status={changedStatus} />
          </Box>
          <Typography
            component="span"
            variant="body1"
            noWrap
            sx={{ lineHeight: 1, m: 0 }}
          >
            {toStatusHumanReadable(changedStatus)}
          </Typography>
        </Box>
      </Box>
    </>
  );
}


