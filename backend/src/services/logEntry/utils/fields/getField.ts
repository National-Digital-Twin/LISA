// Global imports
import { randomUUID } from 'crypto';

// Local imports
import { type Field } from 'common/Field';
import { literalString, ns } from '../../../../rdfutil';

function fieldValue(field: Field) {
  if (field.type === 'SelectMulti' && Array.isArray(field.value)) {
    return literalString(JSON.stringify(field.value));
  }
  return literalString(field.value as string);
}

export function getField(field: Field, entryIdNode: unknown): Array<unknown> {
  const fieldNode = ns.data(randomUUID());
  if (field.value) {
    return [
      [fieldNode, ns.rdf.type, ns.lisa.DataField],
      [fieldNode, ns.ies.hasName, literalString(field.id)],
      [fieldNode, ns.lisa.hasFieldType, literalString(field.type)],
      [fieldNode, ns.ies.hasValue, fieldValue(field)],
      [entryIdNode, ns.lisa.hasField, fieldNode]
    ];
  }
  return [];
}
