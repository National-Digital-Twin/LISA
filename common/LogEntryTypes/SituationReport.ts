// Local imports
import { type Field } from '../Field';
import { type LogEntryTypesDictItem } from './types';

const FIELDS: Array<Field> = [
  { id: 'MajorIncident', label: 'Has a major incident been declared?', type: 'YesNo' },
  { id: 'ExactLocation', label: 'Exact location', type: 'Location' },
  { id: 'Hazards', label: 'Hazards present or suspected', type: 'TextArea' },
  { id: 'Access', label: 'Access routes that are safe to use', type: 'TextArea' },
  { id: 'Casualties', label: 'Number, type, and severity of casualties', type: 'TextArea' },
  { id: 'Emergency', label: 'Emergency services present and those required', type: 'TextArea' }
];

const METHANE_HREF = 'https://www.jesip.org.uk/downloads/m-ethane-full-version/';
export const SituationReport: LogEntryTypesDictItem = {
  label: 'SitRep (M/ETHANE)',
  colour: 'blue',
  fields: () => FIELDS,
  noContent: true,
  description: `<a href="${METHANE_HREF}" target="METHANE">Further guidance on M/ETHANE</a>`,
  requireLocation: true
};
