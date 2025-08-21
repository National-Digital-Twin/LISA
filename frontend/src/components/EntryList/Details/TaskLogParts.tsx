// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { PropsWithChildren } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';


type InfoItemProps = Readonly<PropsWithChildren<{ label: string; mb?: number }>>;
type TaskLinkProps = Readonly<PropsWithChildren<{ taskId?: string }>>;

export function InfoItem({ label, children, mb = 2 }: InfoItemProps) {
  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5} sx={{ width: '100%', mb }}>
      <Typography variant="body1" fontWeight="bold">
        {label}
      </Typography>
      {typeof children === 'string' ? (
        <Typography variant="body1">{children}</Typography>
      ) : (
        children
      )}
    </Box>
  );
}

export function TaskLink({
  taskId,
  children,
}: TaskLinkProps) {
  if (!taskId) return <>{children}</>;
  return (
    <Typography component={Link} to={`/tasks/${taskId}`} color="primary" fontWeight="bold">
      {children}
    </Typography>
  );
}