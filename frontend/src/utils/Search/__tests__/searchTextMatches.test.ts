import { type LogEntry } from 'common/LogEntry';
import { searchTextMatches } from '../searchTextMatches';

const DEFAULT_LOG_ENTRY_PROPS = {
  incidentId: 'incident-1',
  dateTime: new Date(Date.now() - 60000).toISOString(), // ensure not future
  type: 'default', // adjust if needed depending on your LogEntryType
  content: {} // default empty content
};

describe('searchTextMatches', () => {
  it('returns true when searchText is an empty string', () => {
    const logEntry = {
      ...DEFAULT_LOG_ENTRY_PROPS,
      content: {}
    } as LogEntry;

    expect(searchTextMatches(logEntry, '')).toBe(true);
  });

  it('returns true when searchText is only whitespace', () => {
    const logEntry = {
      ...DEFAULT_LOG_ENTRY_PROPS,
      content: {}
    } as LogEntry;

    expect(searchTextMatches(logEntry, '   ')).toBe(true);
  });

  it('matches text in content.text property', () => {
    const logEntry = {
      ...DEFAULT_LOG_ENTRY_PROPS,
      content: { text: 'Hello World' }
    } as LogEntry;

    expect(searchTextMatches(logEntry, 'hello')).toBe(true);
    expect(searchTextMatches(logEntry, 'world')).toBe(true);
    expect(searchTextMatches(logEntry, 'lo wo')).toBe(true);
    expect(searchTextMatches(logEntry, 'absent')).toBe(false);
  });

  it('matches text in location.description property', () => {
    const logEntry = {
      ...DEFAULT_LOG_ENTRY_PROPS,
      content: {},
      location: { description: 'Sample Location Description' }
    } as LogEntry;

    expect(searchTextMatches(logEntry, 'sample')).toBe(true);
    expect(searchTextMatches(logEntry, 'location')).toBe(true);
    expect(searchTextMatches(logEntry, 'description')).toBe(true);
    expect(searchTextMatches(logEntry, 'missing')).toBe(false);
  });

  it('matches text in sequence property', () => {
    const logEntry = {
      ...DEFAULT_LOG_ENTRY_PROPS,
      content: {},
      sequence: 'Sequence123'
    } as LogEntry;

    expect(searchTextMatches(logEntry, 'sequence')).toBe(true);
    expect(searchTextMatches(logEntry, '123')).toBe(true);
    expect(searchTextMatches(logEntry, 'no-match')).toBe(false);
  });

  it('matches text in stage property', () => {
    const logEntry = {
      ...DEFAULT_LOG_ENTRY_PROPS,
      content: {},
      stage: 'Monitoring'
    } as LogEntry;

    expect(searchTextMatches(logEntry, 'Monitoring')).toBe(true);
    expect(searchTextMatches(logEntry, 'beta')).toBe(false);
  });

  it('matches text in field value when fields array is provided', () => {
    const logEntry = {
      ...DEFAULT_LOG_ENTRY_PROPS,
      content: {},
      fields: [
        {
          value: 'FieldValueOne',
          id: '',
          type: 'Select'
        },
        {
          value: 'AnotherFieldValue',
          id: '',
          type: 'Select'
        }
      ]
    } as LogEntry;

    // Check match in one of the field objects.
    expect(searchTextMatches(logEntry, 'valueone')).toBe(true);
    expect(searchTextMatches(logEntry, 'another')).toBe(true);
    // Should not match if text is not present.
    expect(searchTextMatches(logEntry, 'nonexistent')).toBe(false);
  });

  it('returns false when no properties or field values match the search text', () => {
    const logEntry = {
      ...DEFAULT_LOG_ENTRY_PROPS,
      content: { text: 'Some text' },
      location: { type: 'description', description: 'Some description' },
      sequence: '123',
      stage: 'Monitoring',
      fields: [
        {
          value: 'Field one',
          id: '',
          type: 'Select'
        }
      ]
    } as LogEntry;

    expect(searchTextMatches(logEntry, 'unmatched')).toBe(false);
  });

  it('handles undefined or missing nested properties gracefully', () => {
    const logEntry = {
      ...DEFAULT_LOG_ENTRY_PROPS,
      // minimal content provided
      content: {},
      // location is provided as an empty object (or could be omitted)
      location: {},
      // fields array with an object that has no value
      fields: [{ value: undefined }]
    } as LogEntry;

    expect(searchTextMatches(logEntry, 'anything')).toBe(false);
  });
});
