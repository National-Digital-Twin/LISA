import { get, post, put, FetchError } from '../index';

/**
 * Helper function to create a fake fetch response.
 *
 * @param overrides - An object containing properties to override.
 * @returns A fake response object.
 */
function createFakeResponse(overrides: Partial<Response> & { jsonData?: unknown }) {
  const { jsonData, ...rest } = overrides;
  return {
    json: jest.fn().mockResolvedValue(jsonData),
    ...rest
  };
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
  });

  describe('post', () => {
    it('should send JSON data with proper headers', async () => {
      const mockData = { message: 'created' };
      const fakeResponse = createFakeResponse({
        ok: true,
        status: 201,
        jsonData: mockData
      });
      (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

      const data = { key: 'value' };
      const result = await post('/test', data);

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    });

    it('should send FormData without the Content-Type header', async () => {
      const mockData = { message: 'form success' };
      const fakeResponse = createFakeResponse({
        ok: true,
        status: 200,
        jsonData: mockData
      });
      (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

      // Create a FormData object.
      const formData = new FormData();
      formData.append('file', new Blob(['content'], { type: 'text/plain' }), 'test.txt');

      await post('/upload', formData);

      const fetchCallOptions = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(fetchCallOptions.headers).not.toHaveProperty('Content-Type');
      expect(fetchCallOptions.body).toBe(formData);
    });
  });

  describe('put', () => {
    it('should send JSON data with proper headers', async () => {
      const mockData = { message: 'updated' };
      const fakeResponse = createFakeResponse({
        ok: true,
        status: 200,
        jsonData: mockData
      });
      (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

      const data = { key: 'updatedValue' };
      const result = await put('/update', data);

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('/api/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    });
  });
});
