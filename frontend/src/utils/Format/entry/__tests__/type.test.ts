import type { LogEntryType } from 'common/LogEntryType';
import { type as getType } from '../type';

jest.mock('common/LogEntryTypes', () => ({
  LogEntryTypes: {
    Specific: { label: 'Specific Label' },
    General: { label: 'General Label' }
  }
}));

describe('type', () => {
  it('returns the correct label for a valid entry type', () => {
    // 'Specific' exists in our mocked LogEntryTypes.
    const result = getType('Specific' as LogEntryType);
    expect(result).toBe('Specific Label');
  });

  it('returns the General label for an invalid entry type', () => {
    const result = getType('NonExistingType' as LogEntryType);
    expect(result).toBe('General Label');
  });
});
