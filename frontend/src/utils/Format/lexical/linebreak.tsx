// Global imports
import { ReactNode } from 'react';

// Local imports
import { Key } from './types';

export function linebreak(key: Key): ReactNode {
  return <br key={key} />;
}
