// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(fn: Function, delay: number = 250) {
  // eslint-disable-next-line no-undef
  let timeout: NodeJS.Timeout;

  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
