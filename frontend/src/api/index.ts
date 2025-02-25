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

export { FetchError };
