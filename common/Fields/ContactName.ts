// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imoprts
import { type Field } from '../Field';

const ContactName: Field = {
  id: 'contactName',
  // eslint-disable-next-line quotes
  label: `Correspondent's name`,
  type: 'Input'
};

export function getContactName(): Field {
  return { ...ContactName };
}
