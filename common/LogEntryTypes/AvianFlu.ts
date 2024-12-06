// Local imports
import { type Field } from '../Field';
import { type FieldGroup } from '../FieldGroup';
import { type Incident } from '../Incident';
import { type LogEntry } from '../LogEntry';
import { type LogEntryTypesDictItem } from './types';
import { getFieldIds } from './utils';

const OccupierConsent: Field = {
  id: 'OccupierConsent',
  label: 'Occupier has given consent for personal details',
  type: 'YesNo',
  hint: 'If the occupier advises yes they consent, then you need to ensure that all the fields are completed in the form to the best of the occupier’s knowledge<br/><br/>If the occupier does not consent, then the form will not ask you to collect their personal details. All you need to collect is the property location',
};
const Location: Field = {
  id: 'Location',
  label: 'Location',
  type: 'Location',
  hint: 'To record the location, you will need to click in the location tab. Please click ‘both a point on a map and a description’ to enable as much detail to be collected as possible about the location'
};

const InitialFields: Field[] = [
  {
    id: 'PrivacyNotice',
    label: 'Privacy notice covered with the occupier',
    type: 'YesNo',
    hint: 'You will be provided with a script which includes the privacy notice which you need to talk through with the occupier so that they understand why you need to collect this information in the form and what we will do with it.'
  },
  OccupierConsent
];

const OccupierFields: Field[] = [
  { id: 'OccupierName', label: 'Name of occupier', type: 'Input' },
  { id: 'OccupierContactNumber', label: 'Contact number', type: 'Input' },
  { id: 'OccupierEmail', label: 'Contact email', type: 'Input' },
  Location
];
const BirdFields: Field[] = [
  {
    id: 'BirdType',
    label: 'Bird species/type',
    type: 'Input',
    hint: 'This is about the birds that the occupier owns and keeps on their property, not wild birds who may visit. How many birds in total per species i.e. Chicken / Duck / Geese'
  },
  {
    id: 'BirdCount',
    label: 'Number of birds',
    type: 'Input',
    hint: 'Total number of birds per species i.e. chicken = 4, Duck = 7, Geese = 1'
  },
  {
    id: 'HousingAndHusbandrySystem',
    label: 'Housing / husbandry system',
    type: 'TextArea',
    hint: 'Are the birds caged / housed or left out in the open with no fencing? Is it a closed in structure or just fenced off with wire/ netting?',
    className: 'full-width'
  }
];
const RiskFactorFields: Field[] = [
  {
    id: 'NextToLargePoultryPremises',
    label: 'Beside poultry premises of 50+ birds',
    type: 'YesNo',
    hint: 'Is the property that you are visiting next to a property which has 50 or more poultry (chicken /duck/ geese/ turkey)?'
  },
  {
    id: 'RecentLiveMovements',
    label: 'Movement of live poultry in last 6 weeks',
    type: 'YesNo',
    hint: 'Has the occupier moved the birds from the property at all in the last 6 weeks?<br /><br /> If yes then in the comments box at the end of the form, add details of the dates and where to.'
  },
  {
    id: 'RecentContactWithLargePoultryPremises',
    label: 'Worker contact with premises of 50+ birds in last 6 weeks',
    type: 'YesNo',
    hint: 'Does the occupier work at any premises with 50+ birds and would have come into contact with the birds there in the last 6 weeks?<br /><br />If yes then in the comments box at the end of the form, add details of the dates and where.'
  },
  {
    id: 'RecentExhibitionAttendance',
    label: 'Birds attended shows/exhibitions in last 6 weeks',
    type: 'YesNo',
    hint: 'Has the occupier taken their birds to any shows or exhibits in the last 6 weeks?<br /><br />If yes then in the comments box at the end of the form, add details of the dates and where.'
  },
  {
    id: 'RecentLiveMarket',
    label: 'Market activity in the last 6 weeks',
    type: 'YesNo',
    hint: 'Has the occupier sold any of their birds (dead or alive) either through private sale or at local markets in the last 6 weeks?<br /><br />If yes then in the comments box at the end of the form, add details of the dates, where and any customer details they may have.'
  },
  {
    id: 'AnyOtherReasonForSuspicion',
    label: 'Other reason to suspect HPAI/LPAI',
    type: 'YesNo',
    hint: 'For example – do the birds that the occupier keeps show any symptoms of Avian Influenza?<br /><br />Birds infected with the most serious strain of bird flu, called highly pathogenic avian influenza (HPAI), usually show some (or all) of the following signs:<ul><li>sudden death</li><li>swollen head</li><li>closed and runny eyes</li><li>lethargy and depression</li><li>lying down and unresponsiveness</li><li>lack of coordination</li><li>eating less than usual</li><li>lethargy</li><li>sudden increase or decrease in water consumption</li><li>head and body shaking</li><li>drooping of the wings</li><li>dragging of legs</li><li>twisting of the head and neck</li><li>swelling and blue discolouration of comb and wattles</li><li>haemorrhages and redness on shanks of the legs and under the skin of the neck</li><li>breathing difficulties such as gaping (mouth breathing), nasal snicking (coughing sound), sneezing, gurgling or rattling</li><li>fever or noticeable increase in body temperature</li><li>discoloured or loose watery droppings</li><li>stop or significant drop in egg production</li></ul>'
  }
];
const OtherFields: Field[] = [
  {
    id: 'TileNumber',
    label: 'Tile No.',
    type: 'Input',
    hint: 'This is the tile number within the 3km protection zone from the infected premises and will also be added along with the foot patrol route number'
  },
  {
    id: 'OccupierCompletedDeclaration',
    label: 'Occupier has completed the declaration form',
    type: 'YesNo',
    hint: 'Form will be provided for signature. Once signed pick yes from the pick list'
  },
  {
    id: 'Comments',
    label: 'Comments',
    type: 'TextArea',
    hint: 'Use this box to provide any extra information you believe to be relevant as advised in the foot patrol briefing',
    className: 'full-width'
  }
];

function getOccupierFields(entry?: Partial<LogEntry>): Array<Field> {
  const consent = entry?.fields?.find((f) => f.id === OccupierConsent.id)?.value;
  if (consent === 'Yes') {
    return [...OccupierFields];
  }
  if (consent === 'No') {
    return [Location];
  }
  return [];
}

function fields(entry?: Partial<LogEntry>): Array<Field> {
  return [
    ...InitialFields,
    ...getOccupierFields(entry),
    ...BirdFields,
    ...RiskFactorFields,
    ...OtherFields
  ];
}

function unselectable(incident?: Partial<Incident>): boolean {
  // Can only be selected if the incident is a bird flu one.
  return incident?.type !== 'AnimalHealthBirdFlu';
}

const GROUPS: Array<FieldGroup> = [
  { id: 'initial', fieldIds: getFieldIds(InitialFields) },
  { id: 'occupier', label: 'Occupier details', fieldIds: getFieldIds(OccupierFields), defaultOpen: true },
  { id: 'birds', label: 'Bird details', fieldIds: getFieldIds(BirdFields) },
  { id: 'riskFactors', label: 'Risk factors', fieldIds: getFieldIds(RiskFactorFields) },
  { id: 'other', label: 'Other details', fieldIds: getFieldIds(OtherFields) }
];

export const AvianFlu: LogEntryTypesDictItem = {
  label: 'Avian influenza visit',
  colour: 'yellow',
  fields,
  groups: GROUPS,
  noContent: true,
  requireLocation: true,
  unselectable
};
