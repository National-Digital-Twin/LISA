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
};

const forms = (data: EntityOptionData[], errors: ValidationError[]) => [
  <EntityOption
    key="description-1"
    icon={<TextSnippetIcon />}
    onClick={data.find((x) => x.id === 'description')!.onClick}
    label="Add a description"
    errored={!!errors.find((error) => error.fieldId === 'content')}
  />,
  <EntityOption
    key="date-and-time-1"
    icon={<AccessTimeIcon />}
    onClick={data.find((x) => x.id === 'dateAndTime')!.onClick}
    label="Add date and time"
    errored={!!errors.find((error) => error.fieldId === 'dateTime')}
  />,
  <EntityOption
    key="location-1"
    icon={<LocationOnIcon />}
    onClick={data.find((x) => x.id === 'location')!.onClick}
    label="Add location(s)"
    errored={
      !!errors.find((error) => error.fieldId === 'location') ||
      !!data.find((x) => x.id === 'location')?.required
    }
  />,
  <EntityOption
    key="attachments-1"
    icon={<AttachFileIcon />}
    onClick={data.find((x) => x.id === 'attachments')!.onClick}
    label="Add attachement(s)"
    errored={false}
  />,
  <EntityOption
    key="sketch-1"
    icon={<DrawIcon />}
    onClick={data.find((x) => x.id === 'sketch')!.onClick}
    label="Add sketch"
    errored={false}
  />
];

export const getEntityOptions = (
  data: EntityOptionData[],
  errors: ValidationError[]
): { [key: string]: ReactNode[] } => ({
  forms: forms(data, errors)
});
