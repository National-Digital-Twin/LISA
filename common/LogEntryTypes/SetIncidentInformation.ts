import { type LogEntry } from 'common/LogEntry';
import { type Field } from '../Field';
import { type LogEntryTypesDictItem } from './types';

const Name: Field = {
  id: 'name',
  label: 'Incident name',
  type: 'Input',
};
const ReferrerName: Field = {
  id: 'referrer.name',
  label: 'Referred by',
  type: 'Input',
};
const ReferrerOrganisation: Field = {
  id: 'referrer.organisation',
  label: 'Organisation',
  type: 'Input',
};
const ReferrerTelephone: Field = {
  id: 'referrer.telephone',
  label: 'Telephone number',
  type: 'Input',
};
const ReferrerEmail: Field = {
  id: 'referrer.email',
  label: 'Email',
  type: 'Input',
};
const ReferrerSupport: Field = {
  id: 'referrer.supportRequested',
  label: 'Support requested?',
  type: 'YesNo',
};
const ReferrerSupportDescription: Field = {
  id: 'referrer.supportDescription',
  label: 'Description of support request',
  type: 'TextArea',
};

function getFields(entry?: Partial<LogEntry>): Field[] {
  const fields = [
    Name,
    ReferrerName,
    ReferrerOrganisation,
    ReferrerTelephone,
    ReferrerEmail,
    ReferrerSupport
  ];
  const suportRequested = entry?.fields?.find((f) => f.id === ReferrerSupport.id)?.value;
  if (suportRequested === 'Yes') {
    fields.push(ReferrerSupportDescription);
  }
  return fields;
}

export const SetIncidentInformation: LogEntryTypesDictItem = {
  label: 'Set incident information',
  colour: 'yellow',
  fields: getFields,
  noContent: true,
  stage: false,
  unselectable: () => true,
};
