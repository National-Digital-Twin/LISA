// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type Field } from 'common/Field';
import { type Incident, type Referrer } from 'common/Incident';

export function applyFieldUpdatesToIncident(incident: Incident, fields?: Field[]): Incident {
  if (!fields?.length) {
    return incident;
  }

  const updatedIncident = { ...incident };
  for (const field of fields) {
    const { id: fieldId, value } = field;
    if (value === undefined || value === null || Array.isArray(value)) {
      continue;
    }

    if (fieldId === 'name') {
      updatedIncident.name = value;
    } else if (fieldId.startsWith('referrer.')) {
      if (!updatedIncident.referrer) {
        updatedIncident.referrer = {
          name: '',
          organisation: '',
          telephone: '',
          email: '',
          supportRequested: 'No'
        };
      }

      const referrerField = fieldId.replace('referrer.', '') as keyof Referrer;
      if (referrerField === 'supportRequested') {
        updatedIncident.referrer.supportRequested = value as Referrer['supportRequested'];
      } else {
        updatedIncident.referrer[referrerField] = value;
      }
    }
  }

  return updatedIncident;
}
