// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Typography } from '@mui/material';

type NotificationContentProps = {
  content: string;
};

export const NotificationContent = ({ content }: NotificationContentProps) => (
  <Box>
    <Typography component="span" variant="body1">
      {content.substring(0, 100)}
    </Typography>
  </Box>
);
