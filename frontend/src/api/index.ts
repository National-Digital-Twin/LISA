// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// This file is arguably redundant at the moment but will be a good place to add
// authentication to requests in the future.

import { FetchError } from './FetchError';

const baseUrl = '/api';

const getHeaders = async (isFormData: boolean = false) => {
  const headers: Record<string, string> = {};

  // if using form data, let the browser set the content type header so the boundary is correct
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const localAuth = localStorage.getItem('local-auth');
  if (localAuth) {
    try {
      const parsed = JSON.parse(localAuth);
      const { userId, userEmail, userName } = parsed;
      headers['X-Auth-User-Id'] = userId;
      headers['X-Auth-User-Email'] = userEmail;
      headers['X-Auth-User-Name'] = userName;
    } catch {
      localStorage.removeItem('local-auth');
    }
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  if (res.status === 302) {
    const value = await res.json();
    throw new FetchError(res.statusText, res.status, value.redirectUrl);
  }

  if (!res.ok) {
    throw new FetchError(res.statusText, res.status);
  }

  return res.json();
};

export const get = async <T>(endpoint: string): Promise<T> => {
  const headers = await getHeaders();
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers
  });

  return handleResponse(res);
};

export const post = async <T>(endpoint: string, data: object | FormData): Promise<T> => {
  const headers = await getHeaders(data instanceof FormData);
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers
  });

  return handleResponse(res);
};

export const put = async <T>(endpoint: string, data: object | FormData): Promise<T> => {
  const headers = await getHeaders();
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers
  });

  return handleResponse(res);
};

export const patch = async <T>(endpoint: string, data: object | FormData): Promise<T> => {
  const headers = await getHeaders(data instanceof FormData);
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'PATCH',
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers
  });

  return handleResponse(res);
};

export { FetchError };
