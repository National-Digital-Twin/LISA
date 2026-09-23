// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

export class FetchError extends Error {
  status?: number;

  redirectUrl?: string;

  constructor(message: string, status: number, redirectUrl?: string, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
    this.redirectUrl = redirectUrl;
  }
}
