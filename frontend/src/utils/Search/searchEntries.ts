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
