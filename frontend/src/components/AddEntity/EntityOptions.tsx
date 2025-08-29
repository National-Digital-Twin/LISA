// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ReactNode } from 'react';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { ValidationError } from '../../utils/types';
import { EntityOption } from './EntityOption';
import { SituationReport } from 'common/LogEntryTypes/SituationReport';
import { RelevantHazards } from 'common/LogEntryTypes/RiskAssessment/hazards/RelevantHazards';

export type EntityOptionData = {
  id: string;
  dependentId?: string;
  onClick: () => void;
  required?: boolean;
  value: string | undefined;
  supportedOffline?: boolean;
  icon?: ReactNode;
  label?: string;
  valueLabel?: string;
  removable?: boolean;
  onRemove?: () => void;
};

function optionDataComponent(
  key: string,
  optionData: EntityOptionData,
  icon: ReactNode,
  label: string,
  errored: boolean
): ReactNode {
  return (
    <EntityOption
      key={key}
      icon={icon}
      onClick={optionData.onClick}
      required={!!optionData.required}
      label={optionData.valueLabel ?? optionData.value ?? label}
      value={optionData.value}
      supportedOffline={!!optionData.supportedOffline}
      errored={errored}
      removable={!!optionData.removable}
      onRemove={optionData.removable ? optionData.onRemove! : () => {}}
    />
  );
}

const descriptionOptionDataComponent = (
  key: string,
  data: EntityOptionData[],
  icon: ReactNode,
  label: string,
  errors: ValidationError[]
) => {
  const optionData = data.find((x) => x.id === key);

  if (optionData) {
    return optionDataComponent(
      `${key}-option`,
      optionData,
      icon,
      label,
      !!errors.find((error) => error.fieldId === 'content' || error.fieldId === 'task_description')
    );
  }

  return undefined;
};

const siteRepDetailsOptionDataComponent = (
  key: string,
  data: EntityOptionData[],
  siteRepFieldIds: string[],
  errors: ValidationError[]
) => {
  const optionData = data.find((x) => x.id === key);

  if (optionData) {
    return optionDataComponent(
      `${key}-option`,
      optionData,
      <TextSnippetOutlinedIcon />,
      'Add details',
      !!errors.some((error) => siteRepFieldIds.includes(error.fieldId))
    );
  }

  return undefined;
};

const hazardsOptionDataComponents = (
  key: string,
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionsData = data.filter((x) => x.id.includes(key));

  return optionsData.map((optionData) =>
    optionDataComponent(
      `${optionData.id}-option`,
      optionData,
      <WarningAmberOutlinedIcon />,
      optionData.label!,
      !!errors.find((error) => error.fieldId.includes(optionData.value ?? 'N/A'))
    )
  );
};

const addCommentsOptionDataComponent = (
  key: string,
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionData = data.find((x) => x.id === key);

  if (optionData) {
    return optionDataComponent(
      `${key}-option`,
      optionData,
      <AddCommentOutlinedIcon />,
      'Add comments',
      !!errors.find((error) => error.fieldId === 'Comments')
    );
  }

  return undefined;
};

const fieldsOptionDataComponents = (
  key: string,
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionsData = data.filter((x) => x.id.includes(key));

  return optionsData.map((optionData) =>
    optionDataComponent(
      `${optionData.id}-option`,
      optionData,
      optionData.icon,
      optionData.label!,
      !!errors.find(
        (error) =>
          error.fieldId === optionData.id.split('-')?.[1] ||
          error.fieldId === optionData.dependentId ||
          error.fieldId === RelevantHazards.id
      )
    )
  );
};

const dateAndTimeOptionDataComponent = (
  key: string,
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionData = data.find((x) => x.id === key);

  if (optionData) {
    return optionDataComponent(
      `${key}-option`,
      optionData,
      <AccessTimeOutlinedIcon />,
      'Add data and time',
      !!errors.find((error) => error.fieldId === 'dateTime')
    );
  }

  return undefined;
};

const locationOptionDataComponent = (
  key: string,
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionData = data.find((x) => x.id === key);

  if (optionData) {
    return optionDataComponent(
      `${key}-option`,
      optionData,
      <LocationOnOutlinedIcon />,
      'Add location(s)',
      !!errors.find(
        (error) =>
          error.fieldId === 'location' ||
          error.fieldId === 'location.type' ||
          error.fieldId === 'location.description' ||
          error.fieldId === 'location.coordinates'
      )
    );
  }

  return undefined;
};

const attachmentsOptionDataComponent = (key: string, data: EntityOptionData[]) => {
  const optionData = data.find((x) => x.id === key);

  if (optionData) {
    return optionDataComponent(
      `${key}-option`,
      optionData,
      <AttachFileOutlinedIcon />,
      'Add attachment(s)',
      false
    );
  }

  return undefined;
};

const sketchOptionDataComponent = (key: string, data: EntityOptionData[]) => {
  const optionData = data.find((x) => x.id === key);

  if (optionData) {
    return optionDataComponent(
      `${key}-option`,
      optionData,
      <DrawOutlinedIcon />,
      'Add sketch',
      false
    );
  }

  return undefined;
};

const taskNameOptionDataComponent = (
  key: string,
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionData = data.find((x) => x.id === key);

  if (optionData) {
    return optionDataComponent(
      `${key}-option`,
      optionData,
      <BadgeOutlinedIcon />,
      'Task name',
      !!errors.find((error) => error.fieldId === 'task_name')
    );
  }

  return undefined;
};

const taskAsigneeOptionDataComponent = (
  key: string,
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionData = data.find((x) => x.id === key);

  if (optionData) {
    return optionDataComponent(
      `${key}-option`,
      optionData,
      <AssignmentTurnedInOutlinedIcon />,
      'Assign to',
      !!errors.find((error) => error.fieldId === 'task_asignee')
    );
  }

  return undefined;
};

const forms = (data: EntityOptionData[], errors: ValidationError[]) => {
  const siteRepFieldIds = SituationReport.fields({})
    .filter((field) => field.id !== 'ExactLocation')
    .map((field) => field.id);

  return [
    descriptionOptionDataComponent(
      'description',
      data,
      <TextSnippetOutlinedIcon />,
      'Add a description',
      errors
    ),
    siteRepDetailsOptionDataComponent('sitRepDetails', data, siteRepFieldIds, errors),
    ...hazardsOptionDataComponents('selectHazard', data, errors),
    addCommentsOptionDataComponent('addComments', data, errors),
    ...fieldsOptionDataComponents('field', data, errors),
    dateAndTimeOptionDataComponent('dateAndTime', data, errors),
    locationOptionDataComponent('location', data, errors),
    attachmentsOptionDataComponent('attachments', data),
    sketchOptionDataComponent('sketch', data)
  ].filter((x) => !!x);
};

const tasks = (data: EntityOptionData[], errors: ValidationError[]) => {
  return [
    taskNameOptionDataComponent('name', data, errors),
    taskAsigneeOptionDataComponent('assignee', data, errors),
    descriptionOptionDataComponent(
      'description',
      data,
      <NotesOutlinedIcon />,
      'Add task description',
      errors
    ),
    locationOptionDataComponent('location', data, errors),
    attachmentsOptionDataComponent('attachments', data),
    sketchOptionDataComponent('sketch', data)
  ].filter((x) => !!x);
};

export const getEntityOptions = (
  entityType: string,
  data: EntityOptionData[],
  errors: ValidationError[]
): ReactNode[] => {
  switch (entityType) {
    case 'forms':
      return forms(data, errors);
    case 'tasks':
      return tasks(data, errors);
    default:
      return [];
  }
};
