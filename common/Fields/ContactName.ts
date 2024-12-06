// Local imoprts
import { type Field } from '../Field';

const ContactName: Field = {
  id: 'ContactName',
  // eslint-disable-next-line quotes
  label: `Correspondent's name`,
  type: 'Input'
};

export function getContactName(): Field {
  return { ...ContactName };
}
