// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { logError } from "./logger";

export const AUTH_REDIRECT_STORAGE_KEY = 'landingPageUrl';

let landingUrl: string | null = null;

export function setLandingUrl(url: string) {
  landingUrl = url;
  try {
    localStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, url);
  } catch(err) {
    logError('Unable to set landing url', err)
  }
}

export function getLandingUrl(): string | null {
  try {
    return landingUrl ?? localStorage.getItem(AUTH_REDIRECT_STORAGE_KEY);
  } catch {
    return landingUrl;
  }
}

export function redirectToLanding(fallback: string = '/') {
  const url = getLandingUrl() ?? fallback;
  window.location.replace(url);
}

export async function primeLandingUrl(): Promise<void> {
  try {
    const res = await fetch('/api/auth/logout-links', {
      cache: 'no-store',
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json() as { landingPageUrl?: string };
      if (data?.landingPageUrl) setLandingUrl(data.landingPageUrl);
    }
  } catch (err) {
    logError('Unable to prime landing url', err)
  }
}
