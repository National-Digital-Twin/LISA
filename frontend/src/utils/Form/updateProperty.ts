// Local imports
import { type FieldValueType } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function updateProperty(obj: any, fieldId: string, value: FieldValueType): any {
  if (fieldId.includes('.')) {
    const parts = fieldId.split('.');
    const firstPart = parts.shift() as string;
    return {
      ...obj,
      [firstPart]: updateProperty(obj[firstPart], parts.join('.'), value)
    };
  }

  return { ...obj, [fieldId]: value };
}
