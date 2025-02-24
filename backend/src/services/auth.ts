import { Request, Response } from 'express';

import { User } from 'common/User';

import { env } from '../settings';
import { getUsers } from '../auth/cognito';

export async function login(
  req: Request<object, object, object, { redirect?: string }>,
  res: Response
) {
  const userDetails = await res.locals.user;
  if (!userDetails) {
    return res.redirect(env.API_URL);
  }
  res.send(userDetails);
  return res.redirect('/');
}

export async function logout(req: Request, res: Response) {
  res.redirect(
    `https://${env.COGNITO_DOMAIN}/logout?${new URLSearchParams({
      response_type: 'code',
      client_id: env.COGNITO_CLIENT_ID,
      scope: 'openid email profile',
      redirect_uri: env.COGNITO_CALLBACK_URL
    })}`
  );
}

export async function callback(req: Request, res: Response) {
  res.redirect('/');
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
