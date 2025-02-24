/* eslint-disable consistent-return */

import { Request, Response, NextFunction } from 'express';
import { CognitoAccessTokenPayload, CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { settings } from '../settings';
import { User } from './user';

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

export function authenticate({ failureRedirect }: { failureRedirect?: string }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'development') {
      const mockUser = {
        email: 'localuser@example.com',
        username: 'localuser',
        displayName: 'test'
      };
      res.locals.user = mockUser;
      next();
    } else {
      try {
        const response = await fetch(`${settings.IDENTITY_API_URL}/api/v1/user-details`, {
          method: 'GET',
          headers: {
            Cookie: req.headers.cookie
          },
          credentials: 'include'
        });

        if (!response.ok) {
          return res.status(403).end();
        }
        if (response.redirected) {
          return res.status(403).end();
        }

        const userDetails = await response.json();
        res.locals.user = userDetails.content;
        next();
      } catch (error) {
        if (failureRedirect) {
          return res.redirect(failureRedirect);
        }
        console.log('Error fetching user details', error);
        return res.status(500).end();
      }
    }
  };
}
