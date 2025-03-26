export class FetchError extends Error {
  status?: number;

  redirectUrl?: string;

  constructor(message: string, status: number, redirectUrl?: string, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
    this.redirectUrl = redirectUrl;
  }
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
