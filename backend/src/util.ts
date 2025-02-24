import { URL } from 'url';

import { CookieManager } from './auth/cookies';
import { env } from './settings';

export const cookieManager = new CookieManager({
  domain: new URL(env.SERVER_URL).hostname,
  path: '/api'
});

export function tryParseJSONArray(str: string) {
  if (str?.startsWith('[')) {
    try {
      return JSON.parse(str) as string[];
    } catch (e) {
      console.info('Could not parse string as JSON', str);
    }
  }
  return str;
}
