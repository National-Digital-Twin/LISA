import { GroupType, UserType } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoAccessTokenPayload, CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

export class User {
  accessToken?: CognitoAccessTokenPayload;

  idToken?: CognitoIdTokenPayload;

  private readonly usernameInternal?: string;

  private cachedCognitoUser?: UserType;

  private groups?: GroupType[];

  private constructor(accessToken?: CognitoAccessTokenPayload, idToken?: CognitoIdTokenPayload, username?: string) {
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.usernameInternal = username;
  }

  get username(): string {
    return this.accessToken?.username ?? this.usernameInternal;
  }

  get displayName(): string {
    if (this.idToken) {
      return this.idToken.name as string;
    }
    return this.username;
  }

  static fromTokens(accessToken: CognitoAccessTokenPayload, idToken: CognitoIdTokenPayload): User {
    return new User(accessToken, idToken);
  }
}
