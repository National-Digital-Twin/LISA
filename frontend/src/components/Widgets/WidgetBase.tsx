// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { PropsWithChildren } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type WidgetBaseProps = PropsWithChildren & {
  title: string;
  onAction?: () => void;
  showArrow?: boolean;
}

const WidgetBase = ({ title, onAction = undefined, showArrow = false, children } : WidgetBaseProps) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">{title}</Typography>
        {showArrow && onAction && (
          <IconButton onClick={onAction} size="small">
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      {children}
    </CardContent>
  </Card>
);

export default WidgetBase;
