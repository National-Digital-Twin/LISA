// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type FilterType } from '../types';
import { authorMatches } from './authorMatches';
import { categoryMatches } from './categoryMatches';
import { searchTextMatches } from './searchTextMatches';

export function searchEntries(e: LogEntry, filters: FilterType, searchText: string): boolean {
  return categoryMatches(e, filters.category)
    && authorMatches(e, filters.author)
    && searchTextMatches(e, searchText);
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
