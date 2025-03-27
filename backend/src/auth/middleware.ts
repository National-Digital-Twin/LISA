// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

/* eslint-disable consistent-return */

import { Request, Response, NextFunction } from 'express';
import { AccessTokenMissingOrExpiredError } from '../errors';
import { settings } from '../settings';
import { getUserDetails } from '../services/auth';
import { User } from './user';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      user: User;
    }
  }
}

export function authenticate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.user = await getUserDetails(req);
      next();
    } catch (error) {
      if (error instanceof AccessTokenMissingOrExpiredError) {
        return res.status(302).json({ redirectUrl: `${settings.LANDING_PAGE_URL}/oauth2/start` });
      }
      console.log('Error authenticating user: ', error);
      return res.status(500).end();
    }
  };
}
