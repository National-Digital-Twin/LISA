import { ReactNode } from 'react';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DrawIcon from '@mui/icons-material/Draw';
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

export const getEntityOptions = (
  data: EntityOptionData[],
  errors: ValidationError[]
): { [key: string]: ReactNode[] } => ({
  forms: forms(data, errors)
});
