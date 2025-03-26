export function tryParseJSONArray(str: string) {
  if (str?.startsWith('[')) {
    try {
      return JSON.parse(str) as string[];
    } catch (e) {
      console.info('Could not parse string as JSON', str);
    }
  }
  return str;
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
