// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Incident } from 'common/Incident';
import { type FieldValueType } from '../types';
import { updateProperty } from './updateProperty';

export function updateIncident(
  incident: Partial<Incident>,
  fieldId: string,
  value: FieldValueType
): Partial<Incident> {
  return updateProperty(incident, fieldId, value) as Partial<Incident>;
}
