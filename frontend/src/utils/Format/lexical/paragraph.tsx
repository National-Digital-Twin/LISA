// Global imports
import { ReactNode } from 'react';

// Local imports
import { Key, Node, TypeFunction } from './types';

export function paragraph(node: Node, key: Key, renderChild: TypeFunction): ReactNode {
  return (
    <p key={key}>
      {node.text ?? null}
      {node.children?.map(
        (value, index) => renderChild(value, `${key}.${index}`)
      )}
    </p>
  );
}
