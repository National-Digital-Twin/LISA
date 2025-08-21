// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type LogEntry } from 'common/LogEntry';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

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
        <Typography variant="body1" fontWeight="bold">
    Assignee changed to:
        </Typography>
        <Typography variant="body1">
          {newAssignee}
        </Typography>
      </Box>
    </>
  );
}
