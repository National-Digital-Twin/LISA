// Local imports
import { type Field } from 'common/Field';
import { ValidationError } from '../types';

export function getError(
  field: Partial<Field>,
  errors: Array<ValidationError>
): ValidationError | undefined {
  if (field.type === 'Location') {
    return errors.find((e) => e.fieldId.includes('location'));
  }
  return errors.find((e) => e.fieldId === field.id);
}
