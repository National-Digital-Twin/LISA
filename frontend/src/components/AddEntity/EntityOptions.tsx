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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SupportOutlinedIcon from '@mui/icons-material/SupportOutlined';
import { ValidationError } from '../../utils/types';
import { EntityOption } from './EntityOption';
import { SituationReport } from 'common/LogEntryTypes/SituationReport';
import { Format } from '../../utils';
import { IncidentType } from 'common/IncidentType';
import { Box } from '@mui/material';
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

const riskAssessmentReviewOptionDataComponent = (
  key: string,
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionData = data.find((x) => x.id === key);

  if (optionData) {
    return optionDataComponent(
      `${key}-option`,
      optionData,
      <TextSnippetOutlinedIcon />,
      'Select risk assessment to review',
      !!errors.find((error) => error.fieldId === 'Review')
    );
  }

  return undefined;
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

const taskAssigneeOptionDataComponent = (
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
      !!errors.find((error) => error.fieldId === 'task_assignee')
    );
  }

  return undefined;
};

const getIncOption = (id: string, data: EntityOptionData[]) => data.find((x) => x.id === id);

const BlankIcon = <Box sx={{ width: 24, height: 24 }} aria-hidden />;

const incidentTypeOptionDataComponent = (data: EntityOptionData[], errors: ValidationError[]) => {
  const optionData = getIncOption('type', data);
  if (!optionData) return undefined;

  const valueLabel = optionData.value
    ? Format.incident.type(optionData.value as IncidentType)
    : undefined;

  return optionDataComponent(
    'inc_type',
    { ...optionData, valueLabel },
    BlankIcon,
    'Select incident type',
    !!errors.find((e) => e.fieldId === 'incident_type')
  );
};

const incidentTimeOptionDataComponent = (data: EntityOptionData[], errors: ValidationError[]) => {
  const optionData = getIncOption('time', data);
  if (!optionData) return undefined;

  const valueLabel = optionData.value ? Format.dateAndTimeMobile(optionData.value) : undefined;

  return optionDataComponent(
    'inc_time',
    { ...optionData, valueLabel },
    <AccessTimeIcon />,
    'Add date and time',
    !!errors.find((e) => e.fieldId === 'incident_time')
  );
};

const incidentNameOptionDataComponent = (data: EntityOptionData[], errors: ValidationError[]) => {
  const optionData = getIncOption('name', data);
  if (!optionData) return undefined;

  return optionDataComponent(
    'inc_name',
    optionData,
    <TextSnippetOutlinedIcon />,
    'Add incident name',
    !!errors.find((e) => e.fieldId === 'incident_name')
  );
};

const incidentReferrerOptionDataComponent = (
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionData = getIncOption('referrer', data);
  if (!optionData) return undefined;

  return optionDataComponent(
    'inc_referrer',
    optionData,
    <PersonOutlineOutlinedIcon />,
    'Referred by',
    !!errors.find((e) => e.fieldId === 'incident_referrer')
  );
};

const incidentOrganisationOptionDataComponent = (
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionData = getIncOption('organisation', data);
  if (!optionData) return undefined;

  return optionDataComponent(
    'inc_organisation',
    optionData,
    <CorporateFareOutlinedIcon />,
    'Organisation',
    !!errors.find((e) => e.fieldId === 'incident_organisation')
  );
};

const incidentPhoneOptionDataComponent = (data: EntityOptionData[], errors: ValidationError[]) => {
  const optionData = getIncOption('phone', data);
  if (!optionData) return undefined;

  return optionDataComponent(
    'inc_phone',
    optionData,
    <LocalPhoneOutlinedIcon />,
    'Telephone number',
    !!errors.find((e) => e.fieldId === 'incident_phone')
  );
};

const incidentEmailOptionDataComponent = (data: EntityOptionData[], errors: ValidationError[]) => {
  const optionData = getIncOption('email', data);
  if (!optionData) return undefined;

  return optionDataComponent(
    'inc_email',
    optionData,
    <EmailOutlinedIcon />,
    'Email',
    !!errors.find((e) => e.fieldId === 'incident_email')
  );
};

const incidentSupportRequestedOptionDataComponent = (
  data: EntityOptionData[],
  errors: ValidationError[]
) => {
  const optionData = getIncOption('supportRequested', data);
  if (!optionData) return undefined;

  return optionDataComponent(
    'inc_support',
    optionData,
    <SupportOutlinedIcon />,
    'Has the referrer requested support from the local resilience team?',
    !!errors.find(
      (e) =>
        e.fieldId === 'incident_supportRequested' || e.fieldId === 'incident_supportDescription'
    )
  );
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
    riskAssessmentReviewOptionDataComponent('riskAssessmentReview', data, errors),
    ...hazardsOptionDataComponents('selectHazard', data, errors),
    addCommentsOptionDataComponent('addComments', data, errors),
    ...fieldsOptionDataComponents('field', data, errors),
    dateAndTimeOptionDataComponent('dateAndTime', data, errors),
    locationOptionDataComponent('location', data, errors),
    attachmentsOptionDataComponent('attachments', data),
    sketchOptionDataComponent('sketch', data)
  ].filter((x) => !!x);
};

const updates = (data: EntityOptionData[], errors: ValidationError[]) =>
  [
    descriptionOptionDataComponent(
      'description',
      data,
      <NotesOutlinedIcon />,
      'Update description',
      errors
    ),
    dateAndTimeOptionDataComponent('dateAndTime', data, errors),
    locationOptionDataComponent('location', data, errors),
    attachmentsOptionDataComponent('attachments', data),
    sketchOptionDataComponent('sketch', data)
  ].filter((x) => !!x);

const tasks = (data: EntityOptionData[], errors: ValidationError[]) => {
  return [
    taskNameOptionDataComponent('name', data, errors),
    taskAssigneeOptionDataComponent('assignee', data, errors),
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

const incidents = (data: EntityOptionData[], errors: ValidationError[]) => {
  return [
    incidentTypeOptionDataComponent(data, errors),
    incidentTimeOptionDataComponent(data, errors),
    incidentNameOptionDataComponent(data, errors),
    incidentReferrerOptionDataComponent(data, errors),
    incidentOrganisationOptionDataComponent(data, errors),
    incidentPhoneOptionDataComponent(data, errors),
    incidentEmailOptionDataComponent(data, errors),
    incidentSupportRequestedOptionDataComponent(data, errors)
  ].filter(Boolean);
};

export const getEntityOptions = (
  entityType: string,
  data: EntityOptionData[],
  errors: ValidationError[]
): ReactNode[] => {
  switch (entityType) {
    case 'forms':
      return forms(data, errors);
    case 'updates':
      return updates(data, errors);
    case 'tasks':
      return tasks(data, errors);
    case 'incidents':
      return incidents(data, errors);
    default:
      return [];
  }
};
