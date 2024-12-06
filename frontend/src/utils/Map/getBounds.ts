// Local imports
import { type Coordinates } from 'common/Location';

type BoundsType = [number, number, number, number];
const MIN_RANGE = 0.005;
export function getBounds(coords: Coordinates[]): BoundsType | undefined {
  if (coords.length < 1) {
    return undefined;
  }
  // Handle a single location as it needs to actually be a bounds.
  if (coords.length === 1) {
    return [
      coords[0].longitude - MIN_RANGE,
      coords[0].latitude - MIN_RANGE,
      coords[0].longitude + MIN_RANGE,
      coords[0].latitude + MIN_RANGE
    ];
  }
  const minBounds: BoundsType = [
    coords[0].longitude, coords[0].latitude, coords[0].longitude, coords[0].latitude
  ];
  return coords.reduce((bounds: BoundsType, coordinates: Coordinates) => ([
    Math.min(bounds[0], coordinates.longitude),
    Math.min(bounds[1], coordinates.latitude),
    Math.max(bounds[2], coordinates.longitude),
    Math.max(bounds[3], coordinates.latitude)
  ] as BoundsType), minBounds);
}
