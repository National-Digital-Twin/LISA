// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { type Field } from 'common/Field';

export const TYPE_FIELD: Field = {
  id: 'location.type',
  type: 'Select',
  label: 'Select location type'
};

export const DESCRIPTION_FIELD: Field = {
  id: 'location.description',
  type: 'Input',
  label: 'Describe the location'
};
