import { Request, Response } from 'express';
import { IncomingMessage } from 'http';
import internal from 'stream';

import { getUsers } from '../auth/cognito';
import { User } from '../auth/user';
import { ApplicationError, AuthCookieMissingOrExpiredError } from '../errors';
import { settings } from '../settings';

async function fetchUserDetails(oidcCookie: string) {
  return fetch(new URL(`${settings.IDENTITY_API_URL}/api/v1/user-details`), {
    method: 'GET',
    headers: {
      'X-Auth-Request-Access-Token': oidcCookie
    },
    credentials: 'include'
  });
}

export async function getUserDetailsForWs(req: IncomingMessage, socket: internal.Duplex) {
  if (settings.NODE_ENV === 'development') {
    return new User('local.user', 'local.user@example.com');
  }

  const oidcCookie = req.headers.cookie['oidc-cookie'];

  if (!oidcCookie) {
    socket.destroy();
    throw new ApplicationError('Error: invalid response recieved when getting user details.');
  }

  const response = await fetchUserDetails(oidcCookie);

  if (!response.ok) {
    socket.destroy();
    throw new ApplicationError(
      `Error: ${response.status}(${response.statusText}) recieved when fetching sign out links.`
    );
  }

  return response.json();
}

export async function getUserDetails(req: Request) {
  if (settings.NODE_ENV === 'development') {
    return new User('local.user', 'local.user@example.com');
  }

  const oidcCookie = req.headers.cookie['oidc-cookie'];

  if (!oidcCookie) {
    throw new AuthCookieMissingOrExpiredError();
  }

  const response = await fetchUserDetails(oidcCookie);

  if (!response.ok) {
    throw new ApplicationError('Error: invalid response recieved when getting user details.');
  }

  return response.json();
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
    const response = await fetch(`${settings.IDENTITY_API_URL}/api/v1/links/sign-out`, {
      method: 'GET'
    });

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
