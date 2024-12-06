// Local imports
import { type Location, type LocationType } from 'common/Location';
import { FullLocationType } from '../types';

export function getNewLocation(type: LocationType, prev: FullLocationType): Location {
  const { description, coordinates } = prev;
  // Indentation looks off... but that's what lint insists on
  switch (type) {
  case 'description':
    return { type, description } as Location;
  case 'coordinates':
    return { type, coordinates } as Location;
  case 'both':
    return { type, description, coordinates } as Location;
  default:
    return { type: 'none' };
  }
}
