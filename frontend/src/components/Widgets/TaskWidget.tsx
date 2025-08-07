// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Typography } from '@mui/material';
import WidgetBase from './WidgetBase';
import { logInfo } from '../../utils/logger';

const TasksWidget = () => {
  const toDoCount = 0;
  const inProgressCount = 0;
  const onNavigate = () => logInfo('Clicked tasks');

  return (
    <WidgetBase title="Your tasks" onAction={onNavigate} showArrow>
      <Box display="flex" flexDirection="column" alignItems="stretch">

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box flex={1} textAlign="center">
            <Typography variant="h5" color="primary">{toDoCount}</Typography>
          </Box>
          <Box flex={1} textAlign="center">
            <Typography variant="h5">{inProgressCount}</Typography>
          </Box>
          <Box flex={1} textAlign="center">
            <Typography variant="h5" sx={{ visibility: 'hidden' }}>0</Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1} textAlign="center">
            <Typography variant="body2" color="primary">To do</Typography>
          </Box>
          <Box flex={1} textAlign="center">
            <Typography variant="body2">In progress</Typography>
          </Box>
          <Box flex={1} textAlign="center">
            <Box>
              <Typography variant="body2" color="lightgrey">Not started</Typography>
              <Typography variant="body2" color="lightgrey">(coming soon)</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </WidgetBase>
  )
};

export default TasksWidget;
