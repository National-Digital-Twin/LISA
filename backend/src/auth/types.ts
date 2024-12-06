import { CognitoAccessTokenPayload, CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

export interface Tokens {
  accessToken: CognitoAccessTokenPayload;
  idToken: CognitoIdTokenPayload;
}

export interface TokenVerifier {
  verify(cookieValue: string, refreshToken: string, forceRefresh: boolean): Promise<[Tokens?, string?]>;
}
