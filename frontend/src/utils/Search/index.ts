// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { searchLocation } from './searchLocation';
import { searchEntries } from './searchEntries';

export const Search = {
  entries: searchEntries,
  location: searchLocation
};
