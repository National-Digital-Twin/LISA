// Global imports
import { ReactNode } from 'react';

// Local imports
import { Key, Node } from './types';

export function text(node: Node, key: Key): ReactNode {
  return <span key={key}>{node.text}</span>;
}
