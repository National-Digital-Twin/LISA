// Global imports
import { ReactNode } from 'react';

// Local imports
import { Key, Node } from './types';

export function mention(node: Node, key: Key): ReactNode {
  return (
    <span
      key={key}
      className="mention"
      data-lexical-mention={node.mentionName}
      data-lexical-mention-type={node.mentionType}
    >
      {node.text}
    </span>
  );
}
