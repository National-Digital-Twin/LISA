// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { copyIntoLogEntry } from './copyIntoLogEntry';
import { getBaseLogEntryFields, getBaseLogEntryFieldsV2 } from './getBaseLogEntryFields';
import { getError } from './getError';
import { getFieldValue } from './getFieldValue';
import { groupHasFields } from './groupHasFields';
import { linkableEntries } from './linkableEntries';
import { updateIncident } from './updateIncident';
import { updateLogEntry } from './updateLogEntry';

const Form = {
  copyIntoLogEntry,
  getBaseLogEntryFields,
  getBaseLogEntryFieldsV2,
  getError,
  getFieldValue,
  groupHasFields,
  linkableEntries,
  updateIncident,
  updateLogEntry
};

export default Form;
