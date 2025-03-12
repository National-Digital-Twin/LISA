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
