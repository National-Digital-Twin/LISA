// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Typography } from '@mui/material';
import { type Task as TaskData } from 'common/Task';
import { Link } from 'react-router-dom';
import { ReactElement } from 'react';
import { useResponsive } from '../../hooks/useResponsiveHook';

const TaskEntry = ({
  isBelowMd,
  direction = undefined,
  children
}: {
  isBelowMd: boolean;
  direction?: string;
  children: ReactElement[];
}) => (
  <Box
    display="flex"
    flexDirection={(direction ?? isBelowMd) ? 'column' : 'row'}
    justifyContent="left"
    component="li"
    gap={0.5}
  >
    {children}
  </Box>
);

const Task = ({ task }: { task: TaskData }) => {
  const { isBelowMd } = useResponsive();

  return (
    <Box display="flex" flexDirection="column" component="ul" gap={2}>
      <TaskEntry isBelowMd={isBelowMd}>
        <Typography variant="body1" fontWeight="bold">
          Task name:
        </Typography>
        <Typography component={Link} to={`/tasks/${task.incidentId}#${task.id}`} color="primary" fontWeight="bold">
          {task.name}
        </Typography>
      </TaskEntry>
      <TaskEntry isBelowMd={isBelowMd}>
        <Typography variant="body1" fontWeight="bold">
          Assigned to:
        </Typography>
        <Typography variant="body1">
          {task.assignee?.username}
        </Typography>
      </TaskEntry>
      <TaskEntry isBelowMd={isBelowMd} direction="column">
        <Typography variant="body1" fontWeight="bold">
          Task description
        </Typography>
        <Typography variant="body1">{task.description}</Typography>
      </TaskEntry>
      <Box />
    </Box>
  );
};

export default Task;
