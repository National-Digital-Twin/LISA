// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import React from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';

export type ListRow = {
  key: string;
  title: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  metaRight?: React.ReactNode;
  titleDot?: React.ReactNode;
  emphasizeTitle?: boolean;
  onClick?: () => void;
  offline?: boolean;
};

type DataListProps = {
  items: ReadonlyArray<ListRow>;
};

export default function DataList({ items }: Readonly<DataListProps>) {
  const hasAnyDots = items.some((item) => item.titleDot !== undefined);

  return (
    <List sx={{ display: 'flex', flexDirection: 'column', padding: 0, gap: '1px' }}>
      {items.map((item) => (
        <ListItem
          key={item.key}
          sx={{
            padding: 2,
            cursor: item.onClick ? 'pointer' : 'default',
            backgroundColor: 'background.paper',
            border: item.offline ? '1px solid' : 'none',
            borderColor: item.offline ? 'error.main' : 'transparent',
            borderRadius: item.offline ? 1 : 0,
            '&:hover': item.onClick ? { backgroundColor: 'action.hover' } : undefined
          }}
          onClick={item.onClick}
        >
          <Box sx={{ width: '100%', display: 'flex', gap: hasAnyDots ? 2 : 0 }} data-testid="list-item-container">
            {hasAnyDots && (
              <Box sx={{ width: 14, flexShrink: 0 }}>
                <Box sx={{ height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.titleDot}
                </Box>
              </Box>
            )}

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ fontWeight: item.emphasizeTitle ? 'bold' : 'normal' }}
                >
                  {item.title}
                </Typography>
                <Typography color="text.secondary">{item.metaRight}</Typography>
              </Box>
              {item.content && <Box>{item.content}</Box>}
              {item.footer && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {item.footer}
                </Typography>
              )}
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
}
