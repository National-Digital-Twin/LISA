import { type Coordinates } from 'common/Location';
import { searchLocation } from '../searchLocation';
import { type LocationResult } from '../../types';

describe('searchLocation', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('should return an empty array when input is falsy', async () => {
    const result = await searchLocation('');
    expect(result).toEqual([]);
  });

  it('should fetch using searchTerm when input is a string', async () => {
    const fakeResults: LocationResult[] = [
      {
        place_id: 1,
        boundingbox: ['1', '2', '3', '4'],
        lat: '12.34',
        lon: '56.78',
        display_name: 'Test Location',
        type: 'test',
        importance: 0.5,
        value: 10,
        label: 'Test'
      }
    ];

    const fetchResponse = {
      json: jest.fn().mockResolvedValue(fakeResults)
    };

    global.fetch = jest.fn().mockResolvedValue(fetchResponse as unknown as Response);

    const searchTerm = 'TestLocation';
    const result = await searchLocation(searchTerm);

    expect(global.fetch).toHaveBeenCalledWith(`/api/searchLocation?searchTerm=${searchTerm}`);
    expect(fetchResponse.json).toHaveBeenCalled();
    expect(result).toEqual(fakeResults);
  });

  it('should fetch using point when input is coordinates', async () => {
    const fakeResults: LocationResult[] = [
      {
        place_id: 2,
        boundingbox: ['5', '6', '7', '8'],
        lat: '34.56',
        lon: '78.90',
        display_name: 'Coordinate Location',
        type: 'coordinate',
        importance: 0.9,
        value: 20,
        label: 'Coordinate'
      }
    ];

    const fetchResponse = {
      json: jest.fn().mockResolvedValue(fakeResults)
    };

    global.fetch = jest.fn().mockResolvedValue(fetchResponse as unknown as Response);

    const coordinates: Coordinates = { latitude: 34.56, longitude: 78.9 };
    const result = await searchLocation(coordinates);
    const expectedPoint = `${coordinates.latitude},${coordinates.longitude}`;

    expect(global.fetch).toHaveBeenCalledWith(`/api/searchLocation?point=${expectedPoint}`);
    expect(fetchResponse.json).toHaveBeenCalled();
    expect(result).toEqual(fakeResults);
  });

  it('should return an empty array when JSON parsing fails', async () => {
    const fetchResponse = {
      json: jest.fn().mockRejectedValue(new Error('JSON Error'))
    };

    global.fetch = jest.fn().mockResolvedValue(fetchResponse as unknown as Response);

    const result = await searchLocation('errorTest');
    expect(result).toEqual([]);
  });
});
