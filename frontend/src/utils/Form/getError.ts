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

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
