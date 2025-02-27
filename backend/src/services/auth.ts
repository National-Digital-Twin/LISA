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
    return new User('local.user', 'local.user@example.com');
  }

  const accessToken = req.header('X-Auth-Request-Access-Token');

  if (!accessToken) {
    throw new AccessTokenMissingOrExpiredError();
  }

  const response = await fetchUserDetails(accessToken);

  if (!response.ok) {
    throw new ApplicationError('Error: invalid response recieved when getting user details.');
  }

  return response.json().then((value) => new User(value.content.username, value.content.email));
}

export async function user(_req: Request, res: Response) {
  // eslint-disable-next-line no-shadow
  const user = res.locals.user;
  if (!user) {
    throw new ApplicationError('Error: the user is not set.');
  }

  res.json({ username: user.username, displayName: user.displayName });
}

export async function logout(_req: Request, res: Response) {
  if (settings.NODE_ENV === 'development') {
    return res.json('/');
  }

  try {
    const response = await fetch(`${settings.LANDING_PAGE_URL}/oauth2/sign-out`, {
      method: 'GET',
      redirect: 'manual'
    });

    if (!response.ok) {
      throw new ApplicationError(
        `Error: ${response.status}(${response.statusText}) recieved when fetching sign out links.`
      );
    }

    return response;
  } catch (error) {
    throw new ApplicationError(error);
  }
}

export async function logoutLinks(_req: Request, res: Response) {
  if (settings.NODE_ENV === 'development') {
    return res.json('/');
  }

  try {
    const response = await fetch(`${settings.IDENTITY_API_URL}/api/v1/links/sign-out`, { method: 'GET' });

    if (!response.ok) {
      throw new ApplicationError(
        `Error: ${response.status}(${response.statusText}) recieved when fetching sign out links.`
      );
    }

    const signoutURL = await response.json();
    return res.json(signoutURL.href);
  } catch (error) {
    throw new ApplicationError(error);
  }
}

export async function users(_req: Request, res: Response) {
  res.json(await getUsers());
}
