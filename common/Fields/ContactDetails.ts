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
