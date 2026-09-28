// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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
  } catch {
    // Do nothing.
  }
  return [];
}
