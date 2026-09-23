// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
 
import { type LocationType, LocationTypes } from 'common/Location';

type LocationDict = { value: LocationType, label: string };
const LOCATION_TYPES: LocationDict[] = Object.keys(LocationTypes).map((key) => (
  { value: key as LocationType, label: LocationTypes[key as LocationType] }
));

export function getLocationTypes(required = false): LocationDict[] {
  if (required) {
    return LOCATION_TYPES.filter((type) => type.value !== 'none');
  }
  return LOCATION_TYPES;
}
