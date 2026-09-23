// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { type Field } from 'common/Field';
import { type FieldGroup } from 'common/FieldGroup';

export function groupHasFields(group: FieldGroup, fields: Array<Field>): boolean {
  return group.fieldIds.some((id) => fields.find((f) => f.id === id));
}
