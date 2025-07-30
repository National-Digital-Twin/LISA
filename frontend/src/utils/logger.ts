// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

/* eslint-disable no-console */

export function logError(context: string, error: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${context}]`, error);
  }
}

export function logInfo(message: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
  }
}