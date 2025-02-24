import { Request, Response } from 'express';

import { User } from 'common/User';

import { settings } from '../settings';
import { getUsers } from '../auth/cognito';

export async function login(
  req: Request<object, object, object, { redirect?: string }>,
  res: Response
) {
  const userDetails = await res.locals.user;
  if (!userDetails) {
    return res.redirect(`${settings.IDENTITY_API_URL}/oauth2/start`);
  }
  res.send(userDetails);
  return res.redirect('/');
}

export async function logout(req: Request, res: Response) {
  try {
    const response = await fetch(`${settings.IDENTITY_API_URL}/api/v1/links/sign-out`, {
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
      return res.redirect(response.url);
    }

    const signoutURL = await response.json();
    return res.redirect(signoutURL.href);
  } catch (error) {
    console.log('Error fetching sign-out url', error);
    return res.status(500).end();
  }
}

export async function user(req: Request, res: Response) {
  // eslint-disable-next-line no-shadow
  const user = res.locals.user;
  if (!user) {
    throw new Error('user is not set');
  }
  res.json({
    username: user.username,
    displayName: user.displayName
  } satisfies User);
}

export async function users(req: Request, res: Response) {
  res.json(await getUsers());
}
