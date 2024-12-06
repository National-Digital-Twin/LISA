// Local imports
import { type Coordinates } from 'common/Location';
import { type LocationResult } from '../types';

type Input = string | Coordinates
export async function searchLocation(input: Input): Promise<LocationResult[]> {
  if (!input) {
    return [];
  }
  let results;
  if (typeof input === 'string') {
    results = await fetch(`/api/searchLocation?searchTerm=${input}`);
  } else {
    const point = `${input.latitude},${input.longitude}`;
    results = await fetch(`/api/searchLocation?point=${point}`);
  }
  let resultJSON;
  try {
    resultJSON = await results.json();
    return resultJSON as LocationResult[];
  } catch (e) {
    // Do nothing.
  }
  return [];
}
