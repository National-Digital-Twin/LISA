// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { ReactNode } from 'react';
import { Typography } from '@mui/material';

// Local imports
import { Key, Node } from './types';

export function mention(node: Node, key: Key): ReactNode {
  return (
    <Typography
      variant="body1"
      component="span"
      fontWeight="bold"
      color="primary"
      key={key}
      sx={{ cursor: 'pointer' }}
      data-lexical-mention={node.mentionName}
      data-lexical-mention-type={node.mentionType}
    >
      {node.text}
    </Typography>
  );
}
