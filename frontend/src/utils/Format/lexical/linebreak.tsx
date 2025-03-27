// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { ReactNode } from 'react';

// Local imports
import { Key } from './types';

export function linebreak(key: Key): ReactNode {
  return <br key={key} />;
}
