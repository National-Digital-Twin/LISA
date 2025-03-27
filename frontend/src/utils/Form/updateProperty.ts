// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
