// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { Typography } from '@mui/material';

type NotificationContentProps = {
  text: string;
};

export const NotificationContent = ({ text }: NotificationContentProps) => (
  <Typography component="span" variant="body1">
    {text}
  </Typography>
);
