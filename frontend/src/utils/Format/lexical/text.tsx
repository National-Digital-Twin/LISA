// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Global imports
import { ReactNode } from 'react';

// Local imports
import { Key, Node } from './types';

export function text(node: Node, key: Key): ReactNode {
  return <span key={key}>{node.text}</span>;
}
