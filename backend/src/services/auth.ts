import { randomUUID } from 'crypto';
import { CookieOptions, Request, Response } from 'express';

import { User } from 'common/User';

import { env } from '../settings';
import { cookieManager, getAuthCallbackURL } from '../util';
import { getUsers, TokensCookie } from '../auth/cognito';

type AuthState = {
  id: string;
  redirectURI?: string;
}

const AUTH_STATE_COOKIE = 'authState';

const authStateCookieConfig: CookieOptions = {
  path: '/api',
  sameSite: 'lax', // So that the browser sends it when redirecting from Cognito. It does not contain any sensitive data.
  httpOnly: true,
};

function createAuthState(redirect: string, res: Response): string {
  const stateId = randomUUID();
  const state: AuthState = { id: stateId };
  if (redirect) {
    state.redirectURI = redirect;
  }

  res.cookie(AUTH_STATE_COOKIE, state, authStateCookieConfig);
  return stateId;
}

export async function login(req: Request<object, object, object, {redirect?: string}>, res: Response) {
  const token = await res.locals.getAccessToken();
  if (!token) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: env.COGNITO_CLIENT_ID,
      scope: 'openid email profile',
      redirect_uri: getAuthCallbackURL(),
      state: createAuthState(req.query.redirect, res),
    });
    res.redirect(`https://${env.COGNITO_DOMAIN}/oauth2/authorize?${params}`);
    return;
  }
  res.redirect('/');
}

export async function logout(req: Request, res: Response) {
  cookieManager.clearCookies(req, res);

  res.redirect(`https://${env.COGNITO_DOMAIN}/logout?${new URLSearchParams({
    response_type: 'code',
    client_id: env.COGNITO_CLIENT_ID,
    scope: 'openid email profile',
    redirect_uri: getAuthCallbackURL(),
    state: createAuthState(undefined, res),
  })}`);
}

export async function callback(req: Request, res: Response) {
  const authState = req.cookies[AUTH_STATE_COOKIE] as AuthState;
  res.clearCookie(AUTH_STATE_COOKIE, authStateCookieConfig);

  const code = req.query.code as string;

  if (!code) {
    console.log('Missing code');
    await logout(req, res);
    return;
  }

  if (!authState || authState.id !== req.query.state) {
    console.log('authState id did not match', req.query.state, authState);
    await logout(req, res);
    return;
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: env.COGNITO_CLIENT_ID,
    redirect_uri: getAuthCallbackURL(),
  });
  if (env.COGNITO_CLIENT_SECRET) {
    params.set('client_secret', env.COGNITO_CLIENT_SECRET);
  }

  const rsp = await fetch(`https://${env.COGNITO_DOMAIN}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (rsp.status === 200) {
    const responseData = JSON.parse(await rsp.text());
    cookieManager.setTokensCookie(JSON.stringify({
      accessToken: responseData.access_token,
      idToken: responseData.id_token,
    } as TokensCookie), req, res);

    cookieManager.setRefreshCookie(responseData.refresh_token, req, res);

    // Cannot do a simple redirect here because of cookie SameSite=Strict setting.
    res.setHeader('Content-Type', 'text/html;charset=utf8');
    res.send(`
    <html lang="en">
    <head>
        <meta http-equiv="refresh" content="0;URL='${authState.redirectURI ?? '/'}'"/><title>Redirecting...</title>
    </head>
    <body></body>
    </html>
    `);
  } else {
    res.sendStatus(403);
    console.log(`Could not retrieve token. Status: ${rsp.status}, data: ${JSON.stringify(await rsp.text())}`);
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
    displayName: user.displayName,
  } satisfies User);
}

export async function users(req: Request, res: Response) {
  res.json(await getUsers());
}
