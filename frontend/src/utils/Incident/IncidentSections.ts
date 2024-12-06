// Local imports
import { type Field } from 'common/Field';
import { type Incident } from 'common/Incident';
import { IncidentSection } from '../types';
import { IncidentTypes } from './IncidentTypes';

const SUMMARY_FIELDS: Array<Field> = [
  { id: 'type', label: 'Incident type', type: 'Select', options: IncidentTypes },
  { id: 'startedAt', label: 'Date and time', type: 'DateTime' },
  { id: 'name', label: 'Incident name', type: 'Input' }
];

const BASE_REFERRAL_FIELDS: Array<Field> = [
  { id: 'referrer.name', label: 'Referred by', type: 'Input' },
  { id: 'referrer.organisation', label: 'Organisation', type: 'Input' },
  { id: 'referrer.telephone', label: 'Telephone number', type: 'Input' },
  { id: 'referrer.email', label: 'Email', type: 'Input' },
  { id: 'referrer.supportRequested', label: 'Has the referrer requested support from the local resilience team?', type: 'YesNo' },
];
const SUPPORT_DESCRIPTION_FIELD: Field = {
  id: 'referrer.supportDescription',
  label: 'Description of support request',
  type: 'TextArea'
};

function referralFields(incident: Partial<Incident>): Array<Field> {
  if (incident.referrer?.supportRequested === 'Yes') {
    return [...BASE_REFERRAL_FIELDS, SUPPORT_DESCRIPTION_FIELD];
  }
  return [...BASE_REFERRAL_FIELDS];
}

export const IncidentSections: Array<IncidentSection> = [
  { id: 'summary', title: 'Summary', fields: () => SUMMARY_FIELDS },
  { id: 'referral', title: 'Referral information', fields: referralFields }
];
