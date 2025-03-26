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

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
