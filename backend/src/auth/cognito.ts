import { CognitoAccessTokenPayload, CognitoIdTokenPayload, JwtPayload } from 'aws-jwt-verify/jwt-model';
import { JwtExpiredError } from 'aws-jwt-verify/error';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import {
  AttributeType,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  UserType
} from '@aws-sdk/client-cognito-identity-provider';

import { UserList, UserListItem } from 'common/User';

import { Tokens, TokenVerifier } from './types';
import { env } from '../settings';

export interface TokensCookie {
  accessToken: string;
  idToken: string;
}

function parseVerifiedJwt(token: string): JwtPayload {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export class CognitoTokenVerifier implements TokenVerifier {
  private readonly domain: string;

  private readonly clientId: string;

  private readonly clientSecret?: string;

  private readonly idVerifier;

  private readonly accessVerifier;

  constructor(cognitoDomain: string, userPoolId: string, clientId: string, clientSecret?: string) {
    this.domain = cognitoDomain;
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.idVerifier = CognitoJwtVerifier.create({
      userPoolId,
      clientId,
      tokenUse: 'id',
    });

    this.accessVerifier = CognitoJwtVerifier.create({
      userPoolId,
      clientId,
      tokenUse: 'access',
    });
  }

  async verify(cookie: string, refreshToken: string, forceRefresh: boolean): Promise<[Tokens?, string?]> {
    if (!cookie) {
      return [];
    }

    const parsedCookie = JSON.parse(cookie) as TokensCookie;

    let accessTokenPayload: CognitoAccessTokenPayload;
    let idTokenPayload: CognitoIdTokenPayload;

    let doRefresh = forceRefresh;
    let newCookie: string;

    try {
      accessTokenPayload = await this.accessVerifier.verify(parsedCookie.accessToken);
      idTokenPayload = await this.idVerifier.verify(parsedCookie.idToken);
    } catch (e) {
      if (e instanceof JwtExpiredError) {
        doRefresh = true;
      } else {
        // console.log("Token verification has failed: ", e);
        return [];
      }
    }

    if (doRefresh) {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.clientId,
      });
      if (this.clientSecret) {
        params.set('client_secret', this.clientSecret);
      }

      const response = await fetch(`https://${this.domain}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      const responseData = JSON.parse(await response.text());
      if (response.status === 200) {
        parsedCookie.accessToken = responseData.access_token;
        parsedCookie.idToken = responseData.id_token;

        newCookie = JSON.stringify(parsedCookie);

        accessTokenPayload = parseVerifiedJwt(parsedCookie.accessToken) as CognitoAccessTokenPayload;
        idTokenPayload = parseVerifiedJwt(parsedCookie.idToken) as CognitoIdTokenPayload;
      } else {
        throw new Error(`Cognito returned status ${response.status}`);
      }
    }

    return [{
      accessToken: accessTokenPayload,
      idToken: idTokenPayload
    }, newCookie];
  }
}

let cognitoClient: CognitoIdentityProviderClient;

export function getCognitoClient() {
  if (!cognitoClient) {
    cognitoClient = new CognitoIdentityProviderClient({});
  }
  return cognitoClient;
}

function getAttribute(attributes: Array<AttributeType>, attr: string): string | undefined {
  for (const a of attributes) {
    if (a.Name === attr) {
      return a.Value;
    }
  }
  return undefined;
}

function getUserAttribute(u: UserType, attr: string): string | undefined {
  return getAttribute(u.Attributes, attr);
}

function cognitoUserToUserListItem(cognitoUser: UserType) {
  return {
    username: cognitoUser.Username,
    displayName: getUserAttribute(cognitoUser, 'name'),
  } satisfies UserListItem;
}

export async function getUsers(): Promise<UserList> {
  const client = getCognitoClient();

  const command = new ListUsersCommand({
    UserPoolId: env.COGNITO_USER_POOL_ID,
  });

  const resp = await client.send(command);
  return resp.Users?.map(cognitoUserToUserListItem);
}
