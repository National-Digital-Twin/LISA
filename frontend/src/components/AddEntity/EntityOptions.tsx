import { ReactNode } from 'react';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { ValidationError } from '../../utils/types';
import { EntityOption } from './EntityOption';

export type EntityOptionData = {
  id: string;
  onClick: () => void;
  required?: boolean;
  value: string | undefined;
  supportedOffline?: boolean;
  icon?: ReactNode;
  label?: string;
};

const forms = (data: EntityOptionData[], errors: ValidationError[]) => {
  const descriptionOptionData = data.find((x) => x.id === 'description');
  const fieldsOptionData = data.filter((x) => x.id.includes('field'));
  const dateAndTimeOptionData = data.find((x) => x.id === 'dateAndTime');
  const locationOptionData = data.find((x) => x.id === 'location');
  const attachmentsOptionData = data.find((x) => x.id === 'attachments');
  const sketchOptionData = data.find((x) => x.id === 'sketch');

  return [
    <EntityOption
      key="description-option"
      icon={<TextSnippetOutlinedIcon />}
      onClick={descriptionOptionData!.onClick}
      required={!!descriptionOptionData?.required}
      value={descriptionOptionData?.value}
      label={descriptionOptionData?.value ?? 'Add a description'}
      supportedOffline={!!descriptionOptionData?.supportedOffline}
      errored={!!errors.find((error) => error.fieldId === 'content')}
    />,
    ...fieldsOptionData.map((fieldOptionData) => (
      <EntityOption
        key={`${fieldOptionData.id}-option`}
        icon={fieldOptionData!.icon}
        onClick={fieldOptionData!.onClick}
        required={!!fieldOptionData.required}
        value={fieldOptionData?.value}
        label={fieldOptionData?.value ?? fieldOptionData.label!}
        supportedOffline={!!fieldOptionData.supportedOffline}
        errored={!!errors.find((error) => error.fieldId === fieldOptionData.id.split('-')?.[1])}
      />
    )),
    <EntityOption
      key="date-and-time-option"
      icon={<AccessTimeIcon />}
      onClick={dateAndTimeOptionData!.onClick}
      required={!!dateAndTimeOptionData?.required}
      value={dateAndTimeOptionData?.value}
      label={dateAndTimeOptionData?.value ?? 'Add date and time'}
      supportedOffline={!!dateAndTimeOptionData?.supportedOffline}
      errored={!!errors.find((error) => error.fieldId === 'dateTime')}
    />,
    <EntityOption
      key="location-option"
      icon={<LocationOnOutlinedIcon />}
      onClick={locationOptionData!.onClick}
      required={!!locationOptionData?.required}
      value={locationOptionData?.value}
      label={locationOptionData?.value ?? 'Add location(s)'}
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
    />,
    <EntityOption
      key="attachments-option"
      icon={<AttachFileIcon />}
      onClick={attachmentsOptionData!.onClick}
      required={!!attachmentsOptionData?.required}
      value={attachmentsOptionData?.value}
      label={attachmentsOptionData?.value ?? 'Add attachement(s)'}
      supportedOffline={!!attachmentsOptionData?.supportedOffline}
      errored={false}
    />,
    <EntityOption
      key="sketch-option"
      icon={<DrawOutlinedIcon />}
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
