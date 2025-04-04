// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type LogEntry } from 'common/LogEntry';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TaskStatus } from 'common/Task';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Status from '../../Status';

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
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" component="ul" gap={2} sx={{ width: '100%', mb: 2}}>
        <Typography variant="body1" fontWeight="bold">
          Task name
        </Typography>
        <Typography component={Link} to={`/tasks/${entry.incidentId}#${taskId}`} color="primary" fontWeight="bold">
          {taskName}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body1" fontWeight="bold" mb={1}>
        Status changed to
        </Typography>
        <Status width="fit-content" status={changedStatus} />
      </Box>
    </>
  );
}


