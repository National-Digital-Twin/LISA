// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

export function tryParseJSONArray(str: string) {
  if (str?.startsWith('[')) {
    try {
      return JSON.parse(str) as string[];
    } catch (e) {
      console.info(`'Could not parse string as JSON: ${e}`, str);
    }
  }
  return str;
}
