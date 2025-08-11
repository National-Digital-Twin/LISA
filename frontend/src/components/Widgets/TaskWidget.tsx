// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Typography, Button } from '@mui/material';
import WidgetBase from './WidgetBase';
import { logInfo } from '../../utils/logger';

const TasksWidget = () => {
  const toDoCount = 0;
  const inProgressCount = 0;

  const onNavigateToDo = () => logInfo('Clicked To do');
  const onNavigateInProgress = () => logInfo('Clicked In progress');
  const onNavigateTasksHeader = () => logInfo('Clicked tasks header');

  const renderCount = (count: number, onClick: () => void) => {
    const isActive = count > 0;
  
    return (
      <Box flex={1} textAlign="center">
        {isActive ? (
          <Button
            onClick={onClick}
            color="primary"
            variant="text"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 500,
              padding: 0,
              minWidth: 0,
              minHeight: 0,
              lineHeight: 1.2,
            }}
          >
            {count}
          </Button>
        ) : (
          <Typography variant="h5">{count}</Typography>
        )}
      </Box>
    );
  };
  
  const renderLabel = (count: number, label: string, onClick: () => void) => {
    const isActive = count > 0;
  
    return (
      <Box flex={1} textAlign="center">
        {isActive ? (
          <Button
            onClick={onClick}
            color="primary"
            variant="text"
            sx={{ textTransform: 'none', padding: 0, minWidth: 0 }}
            aria-label={`View ${label} tasks`}
          >
            <Typography variant="body2" color="primary">{label}</Typography>
          </Button>
        ) : (
          <Typography variant="body2">{label}</Typography>
        )}
      </Box>
    );
  };

  return (
    <WidgetBase title="Your tasks" onAction={onNavigateTasksHeader} actionAriaLabel="Open Tasks" showArrow>
      <Box display="flex" flexDirection="column" alignItems="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          {renderCount(toDoCount, onNavigateToDo)}
          {renderCount(inProgressCount, onNavigateInProgress)}
          <Box flex={1} textAlign="center">
            <Typography variant="h5" sx={{ visibility: 'hidden' }}>0</Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          {renderLabel(toDoCount, 'To do', onNavigateToDo)}
          {renderLabel(inProgressCount, 'In progress', onNavigateInProgress)}
          <Box flex={1} textAlign="center">
            <Box>
              <Typography variant="body2" color="lightgrey">Overdue</Typography>
              <Typography variant="body2" color="lightgrey">(coming soon)</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </WidgetBase>
  );
};

export default TasksWidget;
