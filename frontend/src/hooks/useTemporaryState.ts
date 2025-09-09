// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useRef } from 'react';

export function useTemporaryState<T extends Record<string, unknown>>() {
  const savedState = useRef<T | null>(null);

  const save = (currentState: T) => {
    savedState.current = structuredClone(currentState);
  };

  const getSaved = (): T | null => {
    return savedState.current;
  };

  const clear = () => {
    savedState.current = null;
  };

  const hasChanges = (currentState: T): boolean => {
    if (!savedState.current) return false;
    return JSON.stringify(savedState.current) !== JSON.stringify(currentState);
  };

  const hasChangesInProps = <K extends Partial<T>>(propsToCheck: K): boolean => {
    if (!savedState.current) return false;

    const savedProps = Object.fromEntries(
      Object.keys(propsToCheck).map(key => [key, savedState.current![key as keyof T]])
    );

    return JSON.stringify(savedProps) !== JSON.stringify(propsToCheck);
  };

  return { save, getSaved, clear, hasChanges, hasChangesInProps };
}
