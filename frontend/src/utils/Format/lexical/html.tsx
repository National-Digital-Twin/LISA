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
