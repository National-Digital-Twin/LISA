export class User {
  private readonly usernameInternal: string;

  private readonly emailInternal: string;

  constructor(username: string, email: string) {
    this.usernameInternal = username;
    this.emailInternal = email;
  }

  get username(): string {
    return this.usernameInternal;
  }

  get email(): string {
    return this.emailInternal;
  }

  get displayName(): string {
    const titalizedNames = this.usernameInternal.split('.').map((name) => `${name.charAt(0).toUpperCase()}${name.substring(1)}`);
    return titalizedNames.join(' ');
  }
}
