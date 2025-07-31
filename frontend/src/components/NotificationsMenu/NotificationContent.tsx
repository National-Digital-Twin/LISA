// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Typography } from '@mui/material';
import { Format } from '../../utils';

type NotificationContentProps = {
  sequence: string;
  text: string;
  author: { username: string; displayName: string } | undefined;
  dateTime: string;
};

export const NotificationContent = ({
  sequence,
  text,
  author,
  dateTime
}: NotificationContentProps) => (
  <>
    <Box>
      <Typography component="span" variant="body1">{`#${sequence} - `}</Typography>
      <Typography component="span" variant="body1">
        {text.substring(0, 100)}
      </Typography>
    </Box>
    <Box display="flex" flexDirection="row" gap={2} alignItems="center">
      <Box display="flex" gap={1} alignItems="center">
        <PersonIcon fontSize="small" />
        <Typography fontSize="small" variant="body1">
          {Format.user(author)}
        </Typography>
      </Box>
      <Box display="flex" gap={1} alignItems="center">
        <CalendarMonthIcon fontSize="small" />
        <Typography fontSize="small" variant="body1">
          {Format.date(dateTime)}
        </Typography>
      </Box>
      <Box display="flex" gap={1} alignItems="center">
        <AccessTimeFilledIcon fontSize="small" />
        <Typography fontSize="small" variant="body1">
          {Format.time(dateTime)}
        </Typography>
      </Box>
    </Box>
  </>
);
