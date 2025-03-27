import { type Field } from 'common/Field';
import { getError } from '../getError';
import { ValidationError } from '../../types';

describe('getError', () => {
  it('returns the correct error for a Location type field', () => {
    const field: Partial<Field> = {
      type: 'Location',
      id: 'location-123'
    };
    const errors: Array<ValidationError> = [
      { fieldId: 'user-location-1', error: 'Location error found' },
      { fieldId: 'another-field', error: 'Another error' }
    ];

    const result = getError(field, errors);

    expect(result).toEqual({ fieldId: 'user-location-1', error: 'Location error found' });
  });

  it('returns the correct error for a non-Location type field', () => {
    const field: Partial<Field> = {
      type: 'Label',
      id: 'field-123'
    };
    const errors: Array<ValidationError> = [
      { fieldId: 'field-123', error: 'Text error found' },
      { fieldId: 'other-field', error: 'Another error' }
    ];

    const result = getError(field, errors);

    expect(result).toEqual({ fieldId: 'field-123', error: 'Text error found' });
  });
});
