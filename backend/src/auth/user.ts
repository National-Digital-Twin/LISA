// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

export class User {
  private readonly usernameInternal: string;

  private readonly displayNameInternal: string;

  private readonly emailInternal?: string;

  private readonly groupsInternal?: string[];

  constructor(
    username: string,
    displayName: string,
    email?: string,
    groups?: string[],
  ) {
    this.usernameInternal   = username;
    this.displayNameInternal = displayName;
    this.emailInternal      = email;
    this.groupsInternal     = groups;
  }

  get username(): string {
    return this.usernameInternal;
  }

  get displayName(): string {
    return this.displayNameInternal;
  }

  // Now returns string | undefined
  get email(): string | undefined {
    return this.emailInternal;
  }

  // Now returns string[] | undefined
  get groups(): string[] | undefined {
    return this.groupsInternal;
  }
}

