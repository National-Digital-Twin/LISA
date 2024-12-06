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
