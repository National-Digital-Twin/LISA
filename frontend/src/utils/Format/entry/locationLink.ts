// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { type Location as LocationUnion } from 'common/Location';

export function hasPlottableCoordinates(loc: LocationUnion | null | undefined): boolean {
  if (!loc) return false;
  if (loc.type === 'coordinates' || loc.type === 'both') {
    return Array.isArray(loc.coordinates) && loc.coordinates.length > 0;
  }
  return false;
}