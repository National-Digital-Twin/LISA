// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { copyIntoLogEntry } from './copyIntoLogEntry';
import { getBaseLogEntryFields, getLogEntryTypes } from './getBaseLogEntryFields';
import { getError } from './getError';
import { getFieldIcon } from './getFieldIcon';
import { getFieldValue } from './getFieldValue';
import { groupHasFields } from './groupHasFields';
import { linkableEntries } from './linkableEntries';
import { updateIncident } from './updateIncident';
import { updateLogEntry } from './updateLogEntry';

const Form = {
  copyIntoLogEntry,
  getLogEntryTypes,
  getBaseLogEntryFields,
  getError,
  getFieldValue,
  groupHasFields,
  getFieldIcon,
  linkableEntries,
  updateIncident,
  updateLogEntry
};

export default Form;
