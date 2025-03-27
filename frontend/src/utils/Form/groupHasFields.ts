// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Field } from 'common/Field';
import { type FieldGroup } from 'common/FieldGroup';

export function groupHasFields(group: FieldGroup, fields: Array<Field>): boolean {
  return group.fieldIds.some((id) => fields.find((f) => f.id === id));
}
