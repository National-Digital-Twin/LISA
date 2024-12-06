// Global imports
import { ReactNode } from 'react';

// Local imports
import { lexicalNode } from './lexicalNode';
import { Node } from './types';

export function html(json: string): ReactNode {
  const root: Node = JSON.parse(json)?.root;
  if (root) {
    return (
      <div className="lexical-html">
        {root.children?.map(lexicalNode)}
      </div>
    );
  }
  return null;
}
