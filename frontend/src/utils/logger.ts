// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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