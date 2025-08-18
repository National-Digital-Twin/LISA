import { ReactNode } from 'react';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DrawIcon from '@mui/icons-material/Draw';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import { ValidationError } from '../../utils/types';
import { EntityOption } from './EntityOption';

export type EntityOptionData = {
  id: string;
  onClick: () => void;
  required?: boolean;
  value: string | undefined;
  supportedOffline?: boolean;
};

const forms = (data: EntityOptionData[], errors: ValidationError[]) => {
  const descriptionOptionData = data.find((x) => x.id === 'description');
  const dateAndTimeOptionData = data.find((x) => x.id === 'dateAndTime');
  const locationOptionData = data.find((x) => x.id === 'location');
  const attachmentsOptionData = data.find((x) => x.id === 'attachments');
  const sketchOptionData = data.find((x) => x.id === 'sketch');

  return [
    <EntityOption
      key="description-1"
      icon={<TextSnippetIcon />}
      onClick={descriptionOptionData!.onClick}
      required={!!descriptionOptionData?.required}
      value={descriptionOptionData?.value}
      label={descriptionOptionData?.value ?? 'Add a description'}
      supportedOffline={!!descriptionOptionData?.supportedOffline}
      errored={!!errors.find((error) => error.fieldId === 'content')}
    />,
    <EntityOption
      key="date-and-time-1"
      icon={<AccessTimeIcon />}
      onClick={dateAndTimeOptionData!.onClick}
      required={!!dateAndTimeOptionData?.required}
      value={dateAndTimeOptionData?.value}
      label={dateAndTimeOptionData?.value ?? 'Add date and time'}
      supportedOffline={!!dateAndTimeOptionData?.supportedOffline}
      errored={!!errors.find((error) => error.fieldId === 'dateTime')}
    />,
    <EntityOption
      key="location-1"
      icon={<LocationOnIcon />}
      onClick={locationOptionData!.onClick}
      required={!!locationOptionData?.required}
      value={locationOptionData?.value}
      label={locationOptionData?.value ?? 'Add location(s)'}
      supportedOffline={!!locationOptionData?.supportedOffline}
      errored={!!errors.find((error) => error.fieldId === 'location')}
    />,
    <EntityOption
      key="attachments-1"
      icon={<AttachFileIcon />}
      onClick={attachmentsOptionData!.onClick}
      required={!!attachmentsOptionData?.required}
      value={attachmentsOptionData?.value}
      label={attachmentsOptionData?.value ?? 'Add attachement(s)'}
      supportedOffline={!!attachmentsOptionData?.supportedOffline}
      errored={false}
    />,
    <EntityOption
      key="sketch-1"
      icon={<DrawIcon />}
      onClick={sketchOptionData!.onClick}
      required={!!sketchOptionData?.required}
      value={sketchOptionData?.value}
      label={sketchOptionData?.value ?? 'Add sketch'}
      supportedOffline={!!sketchOptionData?.supportedOffline}
      errored={false}
    />
  ];
};

const tasks = (data: EntityOptionData[], errors: ValidationError[]) => {
  const nameOptionData = data.find((x) => x.id === 'name');
  const assigneeOptionData = data.find((x) => x.id === 'assignee');
  const descriptionOptionData = data.find((x) => x.id === 'description');
  const locationOptionData = data.find((x) => x.id === 'location');
  const attachmentsOptionData = data.find((x) => x.id === 'attachments');
  const sketchOptionData = data.find((x) => x.id === 'sketch');

  return [
    nameOptionData && <EntityOption
      key="name-1"
      icon={<BadgeOutlinedIcon />}
      onClick={nameOptionData.onClick}
      required={!!nameOptionData?.required}
      value={nameOptionData.value}
      label={nameOptionData.value || 'Task name'}
      supportedOffline={!!nameOptionData.supportedOffline}
      errored={!!errors.find((error) => error.fieldId === 'task_name')}
    />,
    assigneeOptionData && <EntityOption
      key="assignee-1"
      icon={<AssignmentTurnedInOutlinedIcon />}
      onClick={assigneeOptionData.onClick}
      required={!!assigneeOptionData.required}
      value={assigneeOptionData.value}
      label={assigneeOptionData.value || 'Assign to'}
      supportedOffline={!!assigneeOptionData.supportedOffline}
      errored={!!errors.find((error) => error.fieldId === 'task_assignee')}
    />,
    descriptionOptionData && <EntityOption
      key="description-1"
      icon={<NotesOutlinedIcon />}
      onClick={descriptionOptionData.onClick}
      required={!!descriptionOptionData.required}
      value={descriptionOptionData.value}
      label={descriptionOptionData.value || 'Add task description'}
      supportedOffline={!!descriptionOptionData.supportedOffline}
      errored={!!errors.find((error) => error.fieldId === 'task_description')}
    />,
    locationOptionData && <EntityOption
      key="location-1"
      icon={<LocationOnIcon />}
      onClick={locationOptionData.onClick}
      required={!!locationOptionData.required}
      value={locationOptionData.value}
      label={locationOptionData.value || 'Add location(s)'}
      supportedOffline={!!locationOptionData.supportedOffline}
      errored={false}
    />,
    attachmentsOptionData && <EntityOption
      key="attachments-1"
      icon={<AttachFileIcon />}
      onClick={attachmentsOptionData.onClick}
      required={!!attachmentsOptionData.required}
      value={attachmentsOptionData.value}
      label={attachmentsOptionData.value || 'Add attachments'}
      supportedOffline={!!attachmentsOptionData.supportedOffline}
      errored={false}
    />,
    sketchOptionData && <EntityOption
      key="sketch-1"
      icon={<DrawIcon />}
      onClick={sketchOptionData.onClick}
      required={!!sketchOptionData.required}
      value={sketchOptionData.value}
      label={sketchOptionData.value || 'Add sketch'}
      supportedOffline={!!sketchOptionData.supportedOffline}
      errored={false}
    />
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
