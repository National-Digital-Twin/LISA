import { CookieOptions, Request, Response } from 'express';

const TOKENS_COOKIE_NAME = 'tokens';
const REFRESH_TOKEN_COOKIE_NAME = 'refreshTok';

export class CookieManager {
  private readonly tokensCookieName: string;

  private readonly refreshTokenCookieName: string;

  private readonly domain: string;

  private readonly path: string;

  constructor({
    tokensCookieName = TOKENS_COOKIE_NAME,
    refreshTokenCookieName = REFRESH_TOKEN_COOKIE_NAME,
    domain,
    path = '/'
  }: {
    tokensCookieName?: string,
    refreshTokenCookieName?: string,
    domain: string,
    path?: string,
  }) {
    this.tokensCookieName = tokensCookieName;
    this.refreshTokenCookieName = refreshTokenCookieName;
    this.domain = domain;
    this.path = path;
  }

  getTokenCookie(cookies: Record<string, string>): string {
    return cookies[this.tokensCookieName];
  }

  getRefreshTokenCookie(cookies: Record<string, string>): string {
    return cookies[this.refreshTokenCookieName];
  }

  private getTokensCookieConfig(req: Request): CookieOptions {
    return {
      domain: this.domain,
      path: this.path,
      secure: this.domain === 'localhost' ? req.secure : true,
      sameSite: 'strict',
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000,
    };
  }

  private getRefreshTokenCookieConfig(req: Request): CookieOptions {
    return {
      domain: this.domain,
      path: this.path,
      secure: this.domain === 'localhost' ? req.secure : true,
      sameSite: 'strict',
      httpOnly: true,
    };
  }

  setTokensCookie(value: string, req: Request, res: Response) {
    res.cookie(this.tokensCookieName, value, this.getTokensCookieConfig(req));
  }

  setRefreshCookie(value: string, req: Request, res: Response) {
    res.cookie(this.refreshTokenCookieName, value, this.getRefreshTokenCookieConfig(req));
  }

  clearCookies(req: Request, res: Response) {
    res.clearCookie(this.tokensCookieName, this.getTokensCookieConfig(req));
    res.clearCookie(this.refreshTokenCookieName, this.getRefreshTokenCookieConfig(req));
  }
}
