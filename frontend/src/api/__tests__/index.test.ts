// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { get, post, FetchError } from '../index';

interface FakeResponseOptions {
  ok: boolean;
  status: number;
  statusText: string;
  jsonData?: unknown;
}

function createFakeResponse({
  ok,
  status,
  statusText,
  jsonData = {}
}: FakeResponseOptions): Response {
  return {
    ok,
    status,
    statusText,
    json: async () => jsonData
  } as Response;
}

describe('API methods', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('get', () => {
    it('should return JSON data on a successful GET request', async () => {
      const mockData = { message: 'success' };
      const fakeResponse = createFakeResponse({
        ok: true,
        status: 200,
        statusText: 'OK',
        jsonData: mockData
      });
      (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

      const result = await get('/test');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should throw a FetchError for a non-ok response', async () => {
      const fakeResponse = createFakeResponse({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        jsonData: {}
      });
      (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

      await expect(get('/notFound')).rejects.toThrow(FetchError);
    });

    it('should throw a FetchError with redirectUrl for a 302 response', async () => {
      const redirectUrl = '/login';
      const fakeResponse = createFakeResponse({
        ok: false,
        status: 302,
        statusText: 'Found',
        jsonData: { redirectUrl }
      });
      (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

      await expect(get('/redirect')).rejects.toThrow(
        expect.objectContaining({
          message: 'Found',
          status: 302,
          redirectUrl
        })
      );
    });

    it('should throw a FetchError for a 403 response', async () => {
      const fakeResponse = createFakeResponse({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        jsonData: {}
      });
      (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

      await expect(get('/forbidden')).rejects.toThrow(
        expect.objectContaining({
          message: 'Forbidden',
          status: 403
        })
      );
    });
  });

  describe('post', () => {
    it('should return JSON data on a successful POST request', async () => {
      const mockData = { message: 'success' };
      const fakeResponse = createFakeResponse({
        ok: true,
        status: 200,
        statusText: 'OK',
        jsonData: mockData
      });
      (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

      const result = await post('/test', { data: 'test' });

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should throw a FetchError for a 403 response', async () => {
      const fakeResponse = createFakeResponse({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        jsonData: {}
      });
      (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

      await expect(post('/forbidden', { data: 'test' })).rejects.toThrow(
        expect.objectContaining({
          message: 'Forbidden',
          status: 403
        })
      );
    });
  });
});
