// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Coordinates, type Location, type LocationType } from 'common/Location';
import { FullLocationType } from '../types';

function normalizeCoordinates(coordinates: Coordinates | Coordinates[] | undefined): Coordinates[] {
  if (!coordinates) return [];
  return Array.isArray(coordinates) ? coordinates : [coordinates];
}

export function getNewLocation(type: LocationType, prev: FullLocationType): Location {
  const { description, coordinates } = prev;

  switch (type) {
    case 'description':
      return { type, description } as Location;
    case 'coordinates':
      return { type, coordinates: normalizeCoordinates(coordinates) } as Location;
    case 'both':
      return { type, description, coordinates: normalizeCoordinates(coordinates) } as Location;
    default:
      return { type: 'none' };
  }
}
