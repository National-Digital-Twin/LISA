// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// filter-utils.test.ts
import {
  getFromAndToFromTimeSelection,
  applyImpliedSelections,
  countActive,
  countActiveForGroup,
} from '../filter-utils';
import type { FilterTree, GroupNode, OptionLeaf, FilterNode, QueryState } from '../filter-types';
  
describe('filter-utils', () => {
  const fixedNow = new Date('2025-02-10T12:00:00Z'); // stable clock
  
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);
  });
  
  afterAll(() => {
    jest.useRealTimers();
  });
  
  describe('getFromAndToFromTimeSelection', () => {
    it('returns last30min range relative to now', () => {
      const { from, to } = getFromAndToFromTimeSelection('last30min');
      expect(to).toBe(fixedNow.getTime());
      expect(from).toBe(fixedNow.getTime() - 30 * 60 * 1000);
    });
  
    it('returns custom range when preset is custom', () => {
      const { from, to } = getFromAndToFromTimeSelection('custom', {
        from: '2025-02-01',
        to: '2025-02-05',
      });
      expect(from).toBe(new Date('2025-02-01').getTime());
      expect(to).toBe(new Date('2025-02-05').getTime());
    });
  
    it('returns empty when preset is undefined', () => {
      const res = getFromAndToFromTimeSelection(undefined);
      expect(res).toEqual({ from: undefined, to: undefined });
    });
  });
  
  describe('applyImpliedSelections', () => {
    const stageGroup: GroupNode = {
      id: 'stage',
      type: 'group',
      label: 'Stage',
      selection: 'multi',
      children: [
          { id: 'all', type: 'option', label: 'All', implies: ['active', 'monitoring', 'recovery', 'response', 'closed'] } as OptionLeaf,
          { id: 'active', type: 'option', label: 'Active', implies: ['monitoring', 'recovery', 'response'] } as OptionLeaf,
          { id: 'monitoring', type: 'option', label: 'Monitoring' } as OptionLeaf,
          { id: 'recovery', type: 'option', label: 'Recovery' } as OptionLeaf,
          { id: 'response', type: 'option', label: 'Response' } as OptionLeaf,
          { id: 'closed', type: 'option', label: 'Closed' } as OptionLeaf,
      ],
    };
  
    const tree: FilterTree = { title: 't', items: [stageGroup] };
  
    it('expands and locks implied options for "all"', () => {
      const { selected, locked } = applyImpliedSelections(new Set(['all']), 'stage', tree);
      expect(selected).toEqual(
        new Set(['all', 'active', 'monitoring', 'recovery', 'response', 'closed'])
      );
      expect(locked).toEqual(new Set(['active', 'monitoring', 'recovery', 'response', 'closed']));
    });
  
    it('expands and locks implied options for "active"', () => {
      const { selected, locked } = applyImpliedSelections(new Set(['active']), 'stage', tree);
      expect(selected).toEqual(new Set(['active', 'monitoring', 'recovery', 'response']));
      expect(locked).toEqual(new Set(['monitoring', 'recovery', 'response']));
    });
  
    it('does nothing when group not found', () => {
      const { selected, locked } = applyImpliedSelections(new Set(['active']), 'missing', tree);
      expect(selected).toEqual(new Set(['active']));
      expect(locked).toEqual(new Set());
    });
  });
  
  describe('countActive', () => {
    it('counts unique parent keys only (e.g., logType.* counts as 1)', () => {
      const values: QueryState['values'] = {
        search: 'term',
        'logType.form': ['action', 'decision'],
        'logType.update': ['general'],
        time: 'custom',
        timeRange: { from: '2025-02-01', to: '' },
        sort: { by: 'x', direction: 'asc' }, // ignored
      };
  
      // keys that contribute: search, logType (deduped from two children), time, timeRange -> 4,
      // BUT our top-level countActive is designed to show number of *parents* with any active value
      // It dedupes by the parent part *only*, so:
      // parents: 'search', 'logType', 'time', 'timeRange' -> 4
      expect(countActive(values)).toBe(4);
    });
  
    it('ignores empty/falsey values', () => {
      const values: QueryState['values'] = {
        search: '',
        author: [],
        time: undefined,
      };
      expect(countActive(values)).toBe(0);
    });
  });
  
  describe('countActiveForGroup (node-aware)', () => {
    const timeGroupSingle: GroupNode = {
      id: 'time',
      type: 'group',
      label: 'Time',
      selection: 'single',
      children: [
          { id: 'last30min', type: 'option', label: 'Last 30 minutes' } as OptionLeaf,
          { id: 'custom', type: 'option', label: 'Custom date range' } as OptionLeaf,
          { id: 'timeRange', type: 'date-range', label: 'Between' },
      ],
    };
  
    const authorGroupMulti: GroupNode = {
      id: 'author',
      type: 'group',
      label: 'Author',
      selection: 'multi',
      children: [
          { id: 'alice', type: 'option', label: 'Alice' } as OptionLeaf,
          { id: 'bob', type: 'option', label: 'Bob' } as OptionLeaf,
      ],
    };
  
    const keywordText: FilterNode = {
      id: 'search',
      type: 'text',
      label: 'Keyword search',
      placeholder: 'Search by name',
    };
  
    const containerLogType: GroupNode = {
      id: 'logType',
      type: 'group',
      label: 'Log type',
      selection: 'none',
      children: [
          {
            id: 'logType.form',
            type: 'group',
            label: 'Form',
            selection: 'multi',
            children: [
              { id: 'action', type: 'option', label: 'Action' } as OptionLeaf,
              { id: 'decision', type: 'option', label: 'Decision' } as OptionLeaf,
            ],
          } as GroupNode,
          { id: 'general', type: 'option', label: 'Update' } as OptionLeaf,
      ],
    };
  
    it('counts 1 for text when non-empty, 0 when empty', () => {
      const valuesA: QueryState['values'] = { search: 'abc' };
      const valuesB: QueryState['values'] = { search: '' };
  
      expect(countActiveForGroup(valuesA, keywordText)).toBe(1);
      expect(countActiveForGroup(valuesB, keywordText)).toBe(0);
    });
  
    it('counts date-range as 1 if from or to is set', () => {
      const node = { id: 'timeRange', type: 'date-range', label: 'Between' } as const;
  
      expect(countActiveForGroup({ timeRange: { from: '2025-02-01' } }, node)).toBe(1);
      expect(countActiveForGroup({ timeRange: { to: '2025-02-10' } }, node)).toBe(1);
      expect(countActiveForGroup({ timeRange: {} }, node)).toBe(0);
      expect(countActiveForGroup({}, node)).toBe(0);
    });
  
    it('single-select group returns 1 if set, does NOT double-count date-range child', () => {
      const values: QueryState['values'] = {
        time: 'custom',
        timeRange: { from: '2025-02-01' }, // should not add to single-select count
      };
      expect(countActiveForGroup(values, timeGroupSingle)).toBe(1);
    });
  
    it('multi-select group counts selected options + child non-option nodes', () => {
      const values: QueryState['values'] = {
        author: ['alice'],
      };
      expect(countActiveForGroup(values, authorGroupMulti)).toBe(1);
  
      const withBoth = { author: ['alice', 'bob'] };
      expect(countActiveForGroup(withBoth, authorGroupMulti)).toBe(2);
    });
  
    it('container (selection: none) sums child groups/leaves', () => {
      const values: QueryState['values'] = {
        'logType.form': ['action', 'decision'], // 2 (multi)
        // 'general' is an option directly under container; options themselves aren’t counted here
      };
      expect(countActiveForGroup(values, containerLogType)).toBe(2);
    });
  });
});
  