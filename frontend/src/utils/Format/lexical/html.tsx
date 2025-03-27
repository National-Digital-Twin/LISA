// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { ReactNode } from 'react';

// Local imports
import { Typography } from '@mui/material';
import { lexicalNode } from './lexicalNode';
import { Node } from './types';

export function html(json: string): ReactNode {
  const root: Node = JSON.parse(json)?.root;

  if (root) {
    return <Typography variant="body1">{root.children?.map(lexicalNode)}</Typography>;
  }
  return null;
}
