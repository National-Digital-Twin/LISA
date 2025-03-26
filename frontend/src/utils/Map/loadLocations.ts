// Local imports
import { type Coordinates } from 'common/Location';
import { debounce } from '../debounce';
import { Search } from '../Search';
import { type AsyncReturnType } from '../types';

type CallbackType = (options: AsyncReturnType<typeof Search.location>) => void;
type Type = (inputValue: string | Coordinates, callback: CallbackType) => void;

function searchLocation(inputValue: string | Coordinates, callback: CallbackType) {
  Search.location(inputValue).then((options) => callback(options));
}

export const loadLocations: Type = debounce(searchLocation, 500);

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
