// Local imports
import { type Field } from '../../../Field';
import { type FieldGroup } from '../../../FieldGroup';
import { type LogEntry } from '../../../LogEntry';
import { RelevantHazards } from './RelevantHazards';
import { type Hazard } from './types';

const RISK_ID = 'Risk';
const APPLICABLE_CONTROLS_TITLE = 'ACTitle';
const FURTHER_ACTION_ID = 'FurtherAction';
const OTHER_ID = 'OtherControl';
const DESCRIPTION_SUFFIX = 'Description';
const NOT_IN_PLACE_INFIX = 'Reason';
const NOT_IN_PLACE_SUFFIX = 'NotInPlace';

function controlId(hazardId: string, id: string, suffix = '', infix = ''): string {
  return `${hazardId}${infix ?? ''}${id}${suffix ?? ''}`;
}

function notInPlaceId(hazardId: string, id: string): string {
  return controlId(hazardId, id, NOT_IN_PLACE_SUFFIX, NOT_IN_PLACE_INFIX);
}

function getRisks(hazard: Hazard): Field {
  return {
    id: controlId(hazard.id, RISK_ID),
    label: 'Risks',
    type: 'Label',
    className: 'full-width',
    hint: hazard.risks
  };
}

function getAppicableControlsTitle(hazard: Hazard): Field {
  return {
    id: controlId(hazard.id, APPLICABLE_CONTROLS_TITLE),
    label: 'Indicate which of the following applicable controls are in place:',
    type: 'Label',
    className: 'full-width',
    hint: 'If a control is not in place, you must explain why.'
  };
}

function getApplicableControl(
  entry: Partial<LogEntry>,
  hazard: Hazard,
  control: { id: string, label: string }
): Array<Field> {
  const id = controlId(hazard.id, control.id);
  const inPlace = entry.fields?.find((f) => f.id === id)?.value;
  if (inPlace === 'No') {
    return [
      { id, label: control.label, type: 'YesNo', className: 'full-width horizontalYN' },
      {
        id: notInPlaceId(hazard.id, control.id),
        label: 'Reason why this is not in place',
        type: 'Input',
        className: 'full-width indent'
      }
    ];
  }
  return [
    { id, label: control.label, type: 'YesNo', className: 'full-width horizontalYN' }
  ];
}

function getOtherApplicableControl(
  entry: Partial<LogEntry>,
  hazard: Hazard
): Array<Field> {
  const id = `${hazard.id}${OTHER_ID}`;
  const inPlace = entry.fields?.find((f) => f.id === id)?.value;
  if (inPlace === 'Yes') {
    return [
      { id, label: 'Other controls in place', type: 'YesNo', className: 'full-width horizontalYN' },
      {
        id: controlId(hazard.id, OTHER_ID, DESCRIPTION_SUFFIX),
        label: 'Describe other controls in place',
        type: 'Input',
        className: 'full-width indent'
      }
    ];
  }
  return [
    { id, label: 'Other controls in place', type: 'YesNo', className: 'full-width horizontalYN' }
  ];
}

function getApplicableControls(entry: Partial<LogEntry>, hazard: Hazard): Array<Field> {
  return hazard.applicableControls.flatMap(
    (control) => getApplicableControl(entry, hazard, control)
  );
}

function getFurtherAction(hazard: Hazard, relevantValue: string | undefined) {
  if (relevantValue === 'Yes') {
    return {
      id: controlId(hazard.id, FURTHER_ACTION_ID),
      label: 'Any further action required or risks identified',
      type: 'TextArea',
      optional: true,
      className: 'full-width'
    };
  }
  return undefined;
}

export function isRelevantHazard(entry: Partial<LogEntry>, hazard: Hazard): boolean {
  const relevant = entry.fields?.find((f) => f.id === RelevantHazards.id)?.value;
  if (Array.isArray(relevant)) {
    return relevant.some((val) => val === hazard.id);
  }
  return false;
}

export function hazardFields(entry: Partial<LogEntry>, hazard: Hazard): Array<Field> {
  if (!isRelevantHazard(entry, hazard)) {
    return [];
  }
  return [
    getRisks(hazard),
    getAppicableControlsTitle(hazard),
    ...getApplicableControls(entry, hazard),
    ...getOtherApplicableControl(entry, hazard),
    getFurtherAction(hazard, 'Yes')
  ].filter((f) => !!f) as Array<Field>;
}

export function hazardGroup(hazard: Hazard): FieldGroup {
  return {
    id: hazard.id,
    label: hazard.label,
    description: hazard.description,
    defaultOpen: hazard.defaultOpen,
    fieldIds: [
      controlId(hazard.id, RISK_ID),
      controlId(hazard.id, APPLICABLE_CONTROLS_TITLE),
      ...hazard.applicableControls.flatMap((control) => [
        controlId(hazard.id, control.id),
        notInPlaceId(hazard.id, control.id),
      ]),
      controlId(hazard.id, OTHER_ID),
      controlId(hazard.id, OTHER_ID, DESCRIPTION_SUFFIX),
      controlId(hazard.id, FURTHER_ACTION_ID)
    ]
  };
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
