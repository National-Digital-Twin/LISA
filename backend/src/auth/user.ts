export class User {
  private readonly usernameInternal: string;

  private readonly displayNameInternal : string;
  
  private readonly emailInternal: string;

  constructor(username: string, email: string, displayName : string) {
    this.usernameInternal = username;
    this.emailInternal = email;
    this.displayNameInternal = displayName;
  }

  get username(): string {
    return this.usernameInternal;
  }

  get email(): string {
    return this.emailInternal;
  }

  get displayName(): string {
    return this.displayNameInternal;
  }
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
