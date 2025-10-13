// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

const ALLOW_MS = 2 * 60 * 1000; //Allows 2 minutes grace for frontend/backend time drift

export function nonFuture(dateString: string) {
  if (dateString) {
    const date = Date.parse(dateString);
    if (!Number.isNaN(date)) {
      // We have an actual date. Make sure it's not in the future.
      if (date > Date.now() + ALLOW_MS) {
        return 'Cannot be in the future';
      }
    }
  }
  return true;
}
