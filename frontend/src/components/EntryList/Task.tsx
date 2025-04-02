import { Box, Typography } from '@mui/material';
import { type LogEntry } from 'common/LogEntry';
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
    justifyContent="space-between"
    component="li"
    gap={0.5}
  >
    {children}
  </Box>
);

const Task = ({ entry }: { entry: LogEntry }) => {
  const { isBelowMd } = useResponsive();
  if (!entry.task) return null;

  return (
    <Box display="flex" flexDirection="column" component="ul" gap={2}>
      <TaskEntry isBelowMd={isBelowMd}>
        <Typography variant="body1" fontWeight="bold">
          Task name
        </Typography>
        <Typography component={Link} to="/" color="primary" fontWeight="bold">
          {entry.task.name}
        </Typography>
      </TaskEntry>
      <TaskEntry isBelowMd={isBelowMd}>
        <Typography variant="body1" fontWeight="bold">
          Assigned to
        </Typography>
        <Typography component={Link} to="/" color="primary" fontWeight="bold">
          {entry.task.assignee?.username}
        </Typography>
      </TaskEntry>
      <TaskEntry isBelowMd={isBelowMd} direction="column">
        <Typography variant="body1" fontWeight="bold">
          Task description
        </Typography>
        <Typography variant="body1">{entry.task.description}</Typography>
      </TaskEntry>
      <Box />
    </Box>
  );
};

export default Task;
