// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imoprts
import { type Field } from '../Field';
import { type LogEntry } from '../LogEntry';
import { CommunicationMethod } from './CommunicationMethod';

const ContactDetails: Field = {
  id: 'ContactDetails',
  label: 'Contact details',
  type: 'Input'
};

export function getContactDetails(
  entry: Partial<LogEntry>,
  className?: string
): Field | undefined {
  const method = entry.fields?.find((f) => f.id === CommunicationMethod.id)?.value;
  if (method === 'Email') {
    return { ...ContactDetails, label: 'From email address', className };
  }
  if (method === 'EmailOutgoing') {
    return { ...ContactDetails, label: 'To email address', className };
  }
  if (method === 'Telephone') {
    return { ...ContactDetails, label: 'Telephone number of caller', className };
  }
  if (method === 'TelephoneOutgoing') {
    return { ...ContactDetails, label: 'Telephone number called', className };
  }
  return undefined;
}
