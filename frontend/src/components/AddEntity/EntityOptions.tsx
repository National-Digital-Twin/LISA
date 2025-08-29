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

const incidents = (data: EntityOptionData[], errors: ValidationError[]) => {
  const typeOptionData = data.find((x) => x.id === 'type');
  const timeOptionData = data.find((x) => x.id === 'time');
  const nameOptionData = data.find((x) => x.id === 'name');
  const referrerOptionData = data.find((x) => x.id === 'referrer');
  const organisationOptionData = data.find((x) => x.id === 'organisation');
  const phoneOptionData = data.find((x) => x.id === 'phone');
  const emailOptionData = data.find((x) => x.id === 'email');
  const supportRequestedOptionData = data.find((x) => x.id === 'supportRequested');

  return [
    typeOptionData && (
      <EntityOption
        key="inc_type"
        icon={<Box sx={{ width: 24, height: 24 }} aria-hidden role="presentation" />}
        onClick={typeOptionData.onClick}
        required={!!typeOptionData.required}
        value={typeOptionData.value}
        label={Format.incident.type(typeOptionData.value as IncidentType) || 'Select incident type'}
        supportedOffline={!!typeOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_type')}
      />
    ),
    timeOptionData && (
      <EntityOption
        key="inc_time"
        icon={<AccessTimeIcon />}
        onClick={timeOptionData.onClick}
        required={!!timeOptionData.required}
        value={timeOptionData.value}
        label={Format.dateAndTimeMobile(timeOptionData.value) || 'Add date and time'}
        supportedOffline={!!timeOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_time')}
      />
    ),
    nameOptionData && (
      <EntityOption
        key="inc_name"
        icon={<TextSnippetOutlinedIcon />}
        onClick={nameOptionData.onClick}
        required={!!nameOptionData?.required}
        value={nameOptionData.value}
        label={nameOptionData.value || 'Add incident name'}
        supportedOffline={!!nameOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_name')}
      />
    ),
    referrerOptionData && (
      <EntityOption
        key="inc_referrer"
        icon={<PersonOutlineOutlinedIcon />}
        onClick={referrerOptionData.onClick}
        required={!!referrerOptionData.required}
        value={referrerOptionData.value}
        label={referrerOptionData.value || 'Referred by'}
        supportedOffline={!!referrerOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_referrer')}
      />
    ),
    organisationOptionData && (
      <EntityOption
        key="inc_organisation"
        icon={<CorporateFareOutlinedIcon />}
        onClick={organisationOptionData.onClick}
        required={!!organisationOptionData.required}
        value={organisationOptionData.value}
        label={organisationOptionData.value || 'Organisation'}
        supportedOffline={!!organisationOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_organisation')}
      />
    ),
    phoneOptionData && (
      <EntityOption
        key="inc_phone"
        icon={<LocalPhoneOutlinedIcon />}
        onClick={phoneOptionData.onClick}
        required={!!phoneOptionData.required}
        value={phoneOptionData.value}
        label={phoneOptionData.value || 'Telephone number'}
        supportedOffline={!!phoneOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_phone')}
      />
    ),
    emailOptionData && (
      <EntityOption
        key="inc_email"
        icon={<EmailOutlinedIcon />}
        onClick={emailOptionData.onClick}
        required={!!emailOptionData.required}
        value={emailOptionData.value}
        label={emailOptionData.value || 'Email'}
        supportedOffline={!!emailOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_email')}
      />
    ),
    supportRequestedOptionData && (
      <EntityOption
        key="inc_support"
        icon={<SupportOutlinedIcon />}
        onClick={supportRequestedOptionData.onClick}
        required={!!supportRequestedOptionData.required}
        value={supportRequestedOptionData.value}
        label={
          supportRequestedOptionData.value ||
          'Has the referrer requested support from the local resilience team?'
        }
        supportedOffline={!!supportRequestedOptionData.supportedOffline}
        errored={!!errors.find(
          (error) =>
            error.fieldId === 'incident_supportRequested' ||
            error.fieldId === 'incident_supportDescription'
        )}
      />
    )
  ].filter(Boolean);
};

const incidents = (data: EntityOptionData[], errors: ValidationError[]) => {
  const typeOptionData = data.find((x) => x.id === 'type');
  const timeOptionData = data.find((x) => x.id === 'time');
  const nameOptionData = data.find((x) => x.id === 'name');
  const referrerOptionData = data.find((x) => x.id === 'referrer');
  const organisationOptionData = data.find((x) => x.id === 'organisation');
  const phoneOptionData = data.find((x) => x.id === 'phone');
  const emailOptionData = data.find((x) => x.id === 'email');
  const supportRequestedOptionData = data.find((x) => x.id === 'supportRequested');

  return [
    typeOptionData && (
      <EntityOption
        key="inc_type"
        icon={<Box sx={{ width: 24, height: 24 }} aria-hidden role="presentation" />}
        onClick={typeOptionData.onClick}
        required={!!typeOptionData.required}
        value={typeOptionData.value}
        label={Format.incident.type(typeOptionData.value as IncidentType) || 'Select incident type'}
        supportedOffline={!!typeOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_type')}
      />
    ),
    timeOptionData && (
      <EntityOption
        key="inc_time"
        icon={<AccessTimeIcon />}
        onClick={timeOptionData.onClick}
        required={!!timeOptionData.required}
        value={timeOptionData.value}
        label={Format.dateAndTimeMobile(timeOptionData.value) || 'Add date and time'}
        supportedOffline={!!timeOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_time')}
      />
    ),
    nameOptionData && (
      <EntityOption
        key="inc_name"
        icon={<TextSnippetOutlinedIcon />}
        onClick={nameOptionData.onClick}
        required={!!nameOptionData?.required}
        value={nameOptionData.value}
        label={nameOptionData.value || 'Add incident name'}
        supportedOffline={!!nameOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_name')}
      />
    ),
    referrerOptionData && (
      <EntityOption
        key="inc_referrer"
        icon={<PersonOutlineOutlinedIcon />}
        onClick={referrerOptionData.onClick}
        required={!!referrerOptionData.required}
        value={referrerOptionData.value}
        label={referrerOptionData.value || 'Referred by'}
        supportedOffline={!!referrerOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_referrer')}
      />
    ),
    organisationOptionData && (
      <EntityOption
        key="inc_organisation"
        icon={<CorporateFareOutlinedIcon />}
        onClick={organisationOptionData.onClick}
        required={!!organisationOptionData.required}
        value={organisationOptionData.value}
        label={organisationOptionData.value || 'Organisation'}
        supportedOffline={!!organisationOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_organisation')}
      />
    ),
    phoneOptionData && (
      <EntityOption
        key="inc_phone"
        icon={<LocalPhoneOutlinedIcon />}
        onClick={phoneOptionData.onClick}
        required={!!phoneOptionData.required}
        value={phoneOptionData.value}
        label={phoneOptionData.value || 'Telephone number'}
        supportedOffline={!!phoneOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_phone')}
      />
    ),
    emailOptionData && (
      <EntityOption
        key="inc_email"
        icon={<EmailOutlinedIcon />}
        onClick={emailOptionData.onClick}
        required={!!emailOptionData.required}
        value={emailOptionData.value}
        label={emailOptionData.value || 'Email'}
        supportedOffline={!!emailOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'incident_email')}
      />
    ),
    supportRequestedOptionData && (
      <EntityOption
        key="inc_support"
        icon={<SupportOutlinedIcon />}
        onClick={supportRequestedOptionData.onClick}
        required={!!supportRequestedOptionData.required}
        value={supportRequestedOptionData.value}
        label={
          supportRequestedOptionData.value ||
          'Has the referrer requested support from the local resilience team?'
        }
        supportedOffline={!!supportRequestedOptionData.supportedOffline}
        errored={!!errors.find(
          (error) =>
            error.fieldId === 'incident_supportRequested' ||
            error.fieldId === 'incident_supportDescription'
        )}
      />
    )
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
    case 'tasks':
      return tasks(data, errors);
    case 'incidents':
      return incidents(data, errors);
    default:
      return [];
  }
};
