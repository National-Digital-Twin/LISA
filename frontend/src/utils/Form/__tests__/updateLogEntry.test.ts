import type { LogEntry } from 'common/LogEntry';
import { updateLogEntry } from '../updateLogEntry';

jest.mock('common/LogEntryTypes', () => ({
  LogEntryTypes: {
    TEST: {
      fields: () => [{ id: 'field1', value: 'defaultValue' }]
    }
  }
}));

describe('updateLogEntry', () => {
  const dummyLogEntry: Partial<LogEntry> = {
    id: 'test-id',
    fields: [{ id: 'field1', type: 'YesNo', value: 'defaultValue' }],
    type: 'AvianFlu'
  };

  it('should update the field entry when a field property is provided with a new value', () => {
    const entry = { ...dummyLogEntry };

    // When updating the field "field1", the logic should replace the old field with a new one
    // where the value is updated to "updatedFieldValue".
    const result = updateLogEntry(entry, 'field1', 'updatedFieldValue');

    expect(result).toEqual({
      field1: 'updatedFieldValue',
      fields: [],
      id: 'test-id',
      type: 'AvianFlu'
    });
  });

  it('should remove any fields that are not in the set of fields', () => {
    const entry = { ...dummyLogEntry, type: 'TEST' };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const result = updateLogEntry(entry, 'field1', 'someFieldValue');

    expect(result).toEqual({
      field1: 'someFieldValue',
      fields: [{ id: 'field1', value: 'someFieldValue' }],
      id: 'test-id',
      type: 'TEST'
    });
  });
});
