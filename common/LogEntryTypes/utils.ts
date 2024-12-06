import { type Field } from '../Field';

export function getFieldIds(fields: Field[]) {
  return fields.map((f) => f.id);
}
