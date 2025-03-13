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
