import type { LogEntryTypeV2 } from 'common/LogEntryType';
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
    const result = getType('specific' as LogEntryTypeV2);
    expect(result).toBe('Specific Label');
  });

  it('returns the General label for an invalid entry type', () => {
    const result = getType('nonExistingType' as LogEntryTypeV2);
    expect(result).toBe('General Label');
  });
});
