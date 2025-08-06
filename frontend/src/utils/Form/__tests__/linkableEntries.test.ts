import type { Field, FieldOption } from 'common/Field';
import type { LogEntry } from 'common/LogEntry';
import { Linkable } from '../../types';
import { linkableEntries } from '../linkableEntries';
import Format from '../../Format';

// Mock the Format.mentionable.entry method so the tests are deterministic.
jest.mock('../../Format', () => ({
  __esModule: true,
  default: {
    mentionable: {
      entry: jest.fn((entry: LogEntry) => ({
        label: `Label ${entry.id}`,
        type: 'LogEntry'
      }))
    }
  }
}));

describe('linkableEntries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array when field.linkableTypes is undefined', () => {
    const field: Field = {
      id: 'field1',
      type: 'Select', // dummy value for FieldType
      value: undefined,
      optional: false,
      options: undefined,
      // linkableTypes not provided
      label: 'Test Field'
    };

    const entries: Array<Linkable> = [
      { id: '1', type: 'general' },
      { id: '2', type: 'decision' }
    ];

    const result: Array<FieldOption> = linkableEntries(field, entries);
    expect(result).toEqual([]);
  });

  it('should filter and map entries based on field.linkableTypes', () => {
    const field: Field = {
      id: 'field2',
      type: 'Label',
      value: '',
      optional: false,
      options: undefined,
      linkableTypes: ['communication', 'general', 'action'],
      label: 'Test Field'
    };

    const entries: Array<Linkable> = [
      { id: '1', type: 'general' },
      { id: '2', type: 'decision' },
      { id: '3', type: 'communication' }
    ];

    const result: Array<FieldOption> = linkableEntries(field, entries);

    // Only entries with type 'log' should be mapped,
    // with each mapped to an object with properties: value and label (plus optional ones)
    expect(result).toEqual([
      { value: '1', label: 'Label 1' },
      { value: '3', label: 'Label 3' }
    ]);

    // Check that Format.mentionable.entry was called two times
    expect(Format.mentionable.entry).toHaveBeenCalledTimes(2);
    expect(Format.mentionable.entry).toHaveBeenCalledWith(entries[0], true);
    expect(Format.mentionable.entry).toHaveBeenCalledWith(entries[2], true);
  });
});
