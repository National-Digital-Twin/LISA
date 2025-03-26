import { Request, Response } from 'express';

import { getUsers } from '../auth/cognito';
import { User } from '../auth/user';
import { ApplicationError, AccessTokenMissingOrExpiredError } from '../errors';
import { settings } from '../settings';

async function fetchUserDetails(accessToken: string) {
  return fetch(new URL(`${settings.IDENTITY_API_URL}/api/v1/user-details`), {
    method: 'GET',
    headers: {
      'X-Auth-Request-Access-Token': accessToken
    },
    credentials: 'include'
  });
}

export async function getUserDetails(req: Request): Promise<User> {
  if (settings.NODE_ENV === 'development') {
    return new User('local.user', 'local.user@example.com', 'Local User');
  } 

  const accessToken = req.header('X-Auth-Request-Access-Token');

  if (!accessToken) {
    throw new AccessTokenMissingOrExpiredError();
  }

  const response = await fetchUserDetails(accessToken);

  if (!response.ok) {
    throw new ApplicationError('Error: invalid response recieved when getting user details.');
  }

  return response.json().then((value) => new User(value.content.username, value.content.email, value.content.displayName));
}

export async function user(_req: Request, res: Response) {
  // eslint-disable-next-line no-shadow
  const user = res.locals.user;
  if (!user) {
    throw new ApplicationError('Error: the user is not set.');
  }

  res.json({ username: user.username, email: user.email, displayName: user.displayName });
}

export async function logoutLinks(_req: Request, res: Response) {
  if (settings.NODE_ENV === 'development') {
    return res.json({ oAuthLogoutUrl: '/', redirect: '/' });
  }

  try {
    const oAuthLogoutUrl = `${settings.LANDING_PAGE_URL}/oauth2/sign_out`;
    const response = await fetch(`${settings.IDENTITY_API_URL}/api/v1/links/sign-out`, { method: 'GET' });

    if (!response.ok) {
      throw new ApplicationError(
        `Error: ${response.status}(${response.statusText}) recieved when fetching sign out links.`
      );
    }

    const logoutRedirect = await response.json();
    return res.json({ oAuthLogoutUrl, redirect: logoutRedirect.href });
  } catch (error) {
    throw new ApplicationError(error);
  }
}

export async function users(_req: Request, res: Response) {
  res.json(await getUsers());
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
