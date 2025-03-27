// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Field } from 'common/Field';
import { type ResultRow } from '../../../../ia';
import { nodeValue } from '../../../../rdfutil';
import { tryParseJSONArray } from '../../../../util';

export function parseFields(results: ResultRow[]) {
  return results.reduce((map, result) => {
    const entryId = nodeValue(result.entryId.value);
    let value: string | string[] = result.fieldValue.value;
    if (result.fieldType?.value === 'SelectMulti') {
      value = tryParseJSONArray(value);
    }
    const field: Partial<Field> = { id: result.fieldName.value, value };
    const fields = map[entryId] || [];
    fields.push(field);
    return { ...map, [entryId]: fields };
  }, new Map<string, Field[]>());
}
