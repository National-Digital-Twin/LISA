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

const forms = (data: EntityOptionData[], errors: ValidationError[]) => {
  const descriptionOptionData = data.find((x) => x.id === 'description');
  const siteRepDetailsOptionData = data.find((x) => x.id === 'siteRepDetails');
  const hazardsOptionData = data.filter((x) => x.id.includes('selectHazard'));
  const addCommentsOptionData = data.find((x) => x.id === 'addComments');
  const fieldsOptionData = data.filter((x) => x.id.includes('field'));
  const dateAndTimeOptionData = data.find((x) => x.id === 'dateAndTime');
  const locationOptionData = data.find((x) => x.id === 'location');
  const attachmentsOptionData = data.find((x) => x.id === 'attachments');
  const sketchOptionData = data.find((x) => x.id === 'sketch');

  const siteRepFieldIds = SituationReport.fields({})
    .filter((field) => field.id !== 'ExactLocation')
    .map((field) => field.id);

  return [
    descriptionOptionData && (
      <EntityOption
        key="description-option"
        icon={<TextSnippetOutlinedIcon />}
        onClick={descriptionOptionData!.onClick}
        required={!!descriptionOptionData?.required}
        value={descriptionOptionData?.value}
        label={
          descriptionOptionData.valueLabel ?? descriptionOptionData.value ?? 'Add a description'
        }
        supportedOffline={!!descriptionOptionData?.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'content')}
        removable={!!descriptionOptionData.removable}
        onRemove={descriptionOptionData.removable ? descriptionOptionData.onRemove! : () => {}}
      />
    ),
    siteRepDetailsOptionData && (
      <EntityOption
        key="site-rep-details-option"
        icon={<TextSnippetOutlinedIcon />}
        onClick={siteRepDetailsOptionData!.onClick}
        required={!!siteRepDetailsOptionData?.required}
        label={
          siteRepDetailsOptionData.valueLabel ?? siteRepDetailsOptionData.label ?? 'Add details'
        }
        value={siteRepDetailsOptionData?.value}
        supportedOffline={!!siteRepDetailsOptionData?.supportedOffline}
        errored={!!errors.some((error) => siteRepFieldIds.includes(error.fieldId))}
        removable={!!siteRepDetailsOptionData.removable}
        onRemove={
          siteRepDetailsOptionData.removable ? siteRepDetailsOptionData.onRemove! : () => {}
        }
      />
    ),
    ...hazardsOptionData.map((hazardOptionData) => (
      <EntityOption
        key={`${hazardOptionData.id}-option`}
        icon={<WarningAmberOutlinedIcon />}
        onClick={hazardOptionData!.onClick}
        required={!!hazardOptionData.required}
        value={hazardOptionData.value}
        label={hazardOptionData.valueLabel ?? hazardOptionData.value ?? hazardOptionData.label!}
        supportedOffline={!!hazardOptionData.supportedOffline}
        errored={!!errors.some((error) => error.fieldId.includes(hazardOptionData.value ?? 'N/A'))}
        removable={!!hazardOptionData.removable}
        onRemove={hazardOptionData.removable ? hazardOptionData.onRemove! : () => {}}
      />
    )),
    addCommentsOptionData && (
      <EntityOption
        key={`${addCommentsOptionData.id}-option`}
        icon={<AddCommentOutlinedIcon />}
        onClick={addCommentsOptionData!.onClick}
        required={!!addCommentsOptionData.required}
        value={addCommentsOptionData.value}
        label={
          addCommentsOptionData.valueLabel ??
          addCommentsOptionData.value ??
          addCommentsOptionData.label!
        }
        supportedOffline={!!addCommentsOptionData.supportedOffline}
        errored={!!errors.find((x) => x.fieldId === 'content')}
        removable={!!addCommentsOptionData.removable}
        onRemove={addCommentsOptionData.removable ? addCommentsOptionData.onRemove! : () => {}}
      />
    ),
    ...fieldsOptionData.map((fieldOptionData) => (
      <EntityOption
        key={`${fieldOptionData.id}-option`}
        icon={fieldOptionData!.icon}
        onClick={fieldOptionData!.onClick}
        required={!!fieldOptionData.required}
        value={fieldOptionData?.value}
        label={fieldOptionData.valueLabel ?? fieldOptionData.value ?? fieldOptionData.label!}
        supportedOffline={!!fieldOptionData.supportedOffline}
        errored={
          !!errors.find(
            (error) =>
              error.fieldId === fieldOptionData.id.split('-')?.[1] ||
              error.fieldId === fieldOptionData.dependentId ||
              error.fieldId === RelevantHazards.id
          )
        }
        removable={!!fieldOptionData.removable}
        onRemove={fieldOptionData.removable ? fieldOptionData.onRemove! : () => {}}
      />
    )),
    <EntityOption
      key="date-and-time-option"
      icon={<AccessTimeOutlinedIcon />}
      onClick={dateAndTimeOptionData!.onClick}
      required={!!dateAndTimeOptionData?.required}
      value={dateAndTimeOptionData?.value}
      label={
        dateAndTimeOptionData?.valueLabel ?? dateAndTimeOptionData?.value ?? 'Add date and time'
      }
      supportedOffline={!!dateAndTimeOptionData?.supportedOffline}
      errored={!!errors.find((error) => error.fieldId === 'dateTime')}
      removable={!!dateAndTimeOptionData?.removable}
      onRemove={dateAndTimeOptionData?.removable ? dateAndTimeOptionData.onRemove! : () => {}}
    />,
    <EntityOption
      key="location-option"
      icon={<LocationOnOutlinedIcon />}
      onClick={locationOptionData!.onClick}
      required={!!locationOptionData?.required}
      value={locationOptionData?.value}
      label={
        locationOptionData?.valueLabel ??
        locationOptionData?.value ??
        locationOptionData?.label ??
        'Add location(s)'
      }
      supportedOffline={!!locationOptionData?.supportedOffline}
      errored={
        !!errors.find(
          (error) =>
            error.fieldId === 'location' ||
            error.fieldId === 'location.type' ||
            error.fieldId === 'location.description' ||
            error.fieldId === 'location.coordinates'
        )
      }
      removable={!!locationOptionData?.removable}
      onRemove={locationOptionData?.removable ? locationOptionData.onRemove! : () => {}}
    />,
    <EntityOption
      key="attachments-option"
      icon={<AttachFileOutlinedIcon />}
      onClick={attachmentsOptionData!.onClick}
      required={!!attachmentsOptionData?.required}
      value={attachmentsOptionData?.value}
      label={
        attachmentsOptionData?.valueLabel ?? attachmentsOptionData?.value ?? 'Add attachement(s)'
      }
      supportedOffline={!!attachmentsOptionData?.supportedOffline}
      errored={false}
      removable={!!attachmentsOptionData?.removable}
      onRemove={attachmentsOptionData?.removable ? attachmentsOptionData.onRemove! : () => {}}
    />,
    <EntityOption
      key="sketch-option"
      icon={<DrawOutlinedIcon />}
      onClick={sketchOptionData!.onClick}
      required={!!sketchOptionData?.required}
      value={sketchOptionData?.value}
      label={sketchOptionData?.valueLabel ?? sketchOptionData?.value ?? 'Add sketch'}
      supportedOffline={!!sketchOptionData?.supportedOffline}
      errored={false}
      removable={!!sketchOptionData?.removable}
      onRemove={sketchOptionData?.removable ? sketchOptionData.onRemove! : () => {}}
    />
  ].filter(Boolean);
};

const tasks = (data: EntityOptionData[], errors: ValidationError[]) => {
  const nameOptionData = data.find((x) => x.id === 'name');
  const assigneeOptionData = data.find((x) => x.id === 'assignee');
  const descriptionOptionData = data.find((x) => x.id === 'description');
  const locationOptionData = data.find((x) => x.id === 'location');
  const attachmentsOptionData = data.find((x) => x.id === 'attachments');
  const sketchOptionData = data.find((x) => x.id === 'sketch');

  return [
    nameOptionData && (
      <EntityOption
        key="name-1"
        icon={<BadgeOutlinedIcon />}
        onClick={nameOptionData.onClick}
        required={!!nameOptionData?.required}
        value={nameOptionData.value}
        label={nameOptionData.valueLabel || nameOptionData.value || 'Task name'}
        supportedOffline={!!nameOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'task_name')}
        removable={!!nameOptionData.removable}
        onRemove={nameOptionData.removable ? nameOptionData.onRemove! : () => {}}
      />
    ),
    assigneeOptionData && (
      <EntityOption
        key="assignee-1"
        icon={<AssignmentTurnedInOutlinedIcon />}
        onClick={assigneeOptionData.onClick}
        required={!!assigneeOptionData.required}
        value={assigneeOptionData.value}
        label={assigneeOptionData.valueLabel || assigneeOptionData.value || 'Assign to'}
        supportedOffline={!!assigneeOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'task_assignee')}
        removable={!!assigneeOptionData.removable}
        onRemove={assigneeOptionData.removable ? assigneeOptionData.onRemove! : () => {}}
      />
    ),
    descriptionOptionData && (
      <EntityOption
        key="description-1"
        icon={<NotesOutlinedIcon />}
        onClick={descriptionOptionData.onClick}
        required={!!descriptionOptionData.required}
        value={descriptionOptionData.value}
        label={
          descriptionOptionData.valueLabel || descriptionOptionData.value || 'Add task description'
        }
        supportedOffline={!!descriptionOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === 'task_description')}
        removable={!!descriptionOptionData.removable}
        onRemove={descriptionOptionData.removable ? descriptionOptionData.onRemove! : () => {}}
      />
    ),
    locationOptionData && (
      <EntityOption
        key="location-1"
        icon={<LocationOnOutlinedIcon />}
        onClick={locationOptionData.onClick}
        required={!!locationOptionData.required}
        value={locationOptionData.value}
        label={locationOptionData.valueLabel || locationOptionData.value || 'Add location(s)'}
        supportedOffline={!!locationOptionData.supportedOffline}
        errored={false}
        removable={!!locationOptionData.removable}
        onRemove={locationOptionData.removable ? locationOptionData.onRemove! : () => {}}
      />
    ),
    attachmentsOptionData && (
      <EntityOption
        key="attachments-1"
        icon={<AttachFileOutlinedIcon />}
        onClick={attachmentsOptionData.onClick}
        required={!!attachmentsOptionData.required}
        value={attachmentsOptionData.value}
        label={attachmentsOptionData.valueLabel || attachmentsOptionData.value || 'Add attachments'}
        supportedOffline={!!attachmentsOptionData.supportedOffline}
        errored={false}
        removable={!!attachmentsOptionData.removable}
        onRemove={attachmentsOptionData.removable ? attachmentsOptionData.onRemove! : () => {}}
      />
    ),
    sketchOptionData && (
      <EntityOption
        key="sketch-1"
        icon={<DrawOutlinedIcon />}
        onClick={sketchOptionData.onClick}
        required={!!sketchOptionData.required}
        value={sketchOptionData.value}
        label={sketchOptionData.valueLabel || sketchOptionData.value || 'Add sketch'}
        supportedOffline={!!sketchOptionData.supportedOffline}
        errored={false}
        removable={!!sketchOptionData.removable}
        onRemove={sketchOptionData.removable ? sketchOptionData.onRemove! : () => {}}
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
    default:
      return [];
  }
};
