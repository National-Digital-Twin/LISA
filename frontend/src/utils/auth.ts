// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

async function clearServiceWorkerCaches() {
  // Clear service worker cache
  if ('caches' in window) {
    await caches.keys().then((cacheNames) => {
      Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    });
  }
}

function clearLocalAndSessionStorage() {
  // Handle client-side storage
  localStorage.clear();
  sessionStorage.clear();
}

export async function logout() {
  let redirect = '/';
  try {
    const response = await fetch('/api/auth/logout-links');
    if (response.ok) {
      const logoutLinks = await response.json();

      await clearServiceWorkerCaches();
      clearLocalAndSessionStorage();

      await fetch(logoutLinks.oAuthLogoutUrl, {
        method: 'GET',
        redirect: 'manual',
        credentials: 'include'
      });

      redirect = logoutLinks.redirect;
    }
  } catch {
    throw new Error('Failed to logout');
  }

  if (document.location.pathname !== redirect) {
    document.location = redirect;
  }
}
