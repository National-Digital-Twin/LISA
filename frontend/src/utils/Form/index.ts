import { copyIntoLogEntry } from './copyIntoLogEntry';
import { getBaseLogEntryFields } from './getBaseLogEntryFields';
import { getError } from './getError';
import { getFieldValue } from './getFieldValue';
import { groupHasFields } from './groupHasFields';
import { linkableEntries } from './linkableEntries';
import { updateIncident } from './updateIncident';
import { updateLogEntry } from './updateLogEntry';

const Form = {
  copyIntoLogEntry,
  getBaseLogEntryFields,
  getError,
  getFieldValue,
  groupHasFields,
  linkableEntries,
  updateIncident,
  updateLogEntry
};

export default Form;
