// Local imports
import { type Field } from 'common/Field';
import { type FieldGroup } from 'common/FieldGroup';

export function groupHasFields(group: FieldGroup, fields: Array<Field>): boolean {
  return group.fieldIds.some((id) => fields.find((f) => f.id === id));
}
