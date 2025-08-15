// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imoprts
import { type Field, type FieldOption } from '../Field';

const CommunicationMethods: Array<FieldOption> = [
  { value: 'Email', label: 'Email received' },
  { value: 'EmailOutgoing', label: 'Email sent' },
  { value: 'Telephone', label: 'Telephone call received' },
  { value: 'TelephoneOutgoing', label: 'Telephone call made' },
  { value: 'InPerson', label: 'Provided to me in person' },
  { value: 'InPersonOutgoing', label: 'Provided by me in person' }
];

export const CommunicationMethod: Field = {
  id: 'CommunicationMethod',
  label: 'Communicated by',
  type: 'Select',
  options: CommunicationMethods,
  dependentFieldIds: ['ContactDetails']
};

export function getCommunicationMethod(label?: string): Field {
  if (label) {
    return { ...CommunicationMethod, label };
  }
  return { ...CommunicationMethod };
}
