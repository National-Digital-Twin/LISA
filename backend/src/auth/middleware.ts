import { Request, Response, NextFunction } from 'express';
import { CognitoAccessTokenPayload, CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

import { User } from './user';
import { TokenVerifier } from './types';
import { CookieManager } from './cookies';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      getAccessToken(): Promise<CognitoAccessTokenPayload>;
      getIdToken(): Promise<CognitoIdTokenPayload>;
      user: User;
    }
  }
}

interface Tokens {
  accessToken: CognitoAccessTokenPayload;
  idToken: CognitoIdTokenPayload;
}

export function extractToken(verifier: TokenVerifier, cookieManager: CookieManager) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let tokens: Tokens;
    let tokenChecked = false;

    const verifyTokens = async () => {
      res.appendHeader('Vary', 'Cookie');
      const tokenCookie = cookieManager.getTokenCookie(req.cookies);
      const refreshToken = cookieManager.getRefreshTokenCookie(req.cookies);
      let newCookie: string;
      [tokens, newCookie] = await verifier.verify(tokenCookie, refreshToken, false);
      tokenChecked = true;
      if (newCookie) {
        cookieManager.setTokensCookie(newCookie, req, res);
      }
    };

    res.locals.getAccessToken = async () => {
      if (!tokenChecked) {
        await verifyTokens();
      }
      return tokens?.accessToken;
    };

    res.locals.getIdToken = async () => {
      if (!tokenChecked) {
        await verifyTokens();
      }
      return tokens?.idToken;
    };

    next();
  };
}

export function authenticate({ failureRedirect }: { failureRedirect?: string }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = await res.locals.getAccessToken();
    if (!accessToken) {
      if (failureRedirect) {
        res.redirect(failureRedirect);
      } else {
        res.status(403);
        res.end();
      }
      return;
    }
    res.locals.user = User.fromTokens(accessToken, await res.locals.getIdToken());
    next();
  };
}

export function authorise({ group }: { group: string }) {
  return async (req, res, next) => {
    const groups = res.locals.user.token['cognito:groups'];
    if (groups?.includes(group)) {
      next();
      return;
    }
    res.status(403);
    res.end();
  };
}

export function createAuthenticator(verifier: TokenVerifier, cookieManager: CookieManager) {
  return async (cookies: Record<string, string>): Promise<User|undefined> => {
    const tokenCookie = cookieManager.getTokenCookie(cookies);
    const refreshToken = cookieManager.getRefreshTokenCookie(cookies);

    const [tokens] = await verifier.verify(tokenCookie, refreshToken, false);
    if (!tokens) {
      return undefined;
    }
    return User.fromTokens(tokens.accessToken, tokens.idToken);
  };
}
