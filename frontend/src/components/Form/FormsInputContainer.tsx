import { RefObject, useMemo, useState } from 'react';
import { Stage } from 'konva/lib/Stage';
import dayjs from 'dayjs';
import { Box, FormControl, MenuItem, TextField, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import {
  DatePicker,
  LocalizationProvider,
  renderTimeViewClock,
  TimePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { type LogEntry } from 'common/LogEntry';
import { type Incident } from 'common/Incident';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { LogEntryType } from 'common/LogEntryType';
import { Mentionable } from 'common/Mentionable';
import { Coordinates, LocationType, type Location as TypeOfLocation } from 'common/Location';
import { FullLocationType, OptionType, SketchLine, ValidationError } from '../../utils/types';
import { EntityInputContainer, EntityInputContainerData } from '../AddEntity/EntityInputContainer';
import { getLogEntryTypes } from '../../utils/Form/getBaseLogEntryFields';
import { EntityOptionsContainer } from '../AddEntity/EntityOptionsContainer';
import { EntityOptionData } from '../AddEntity/EntityOptions';
import { OnFieldChange } from '../../utils/handlers';
import EntryContent from '../lexical/EntryContent';

import { Format, MapUtils } from '../../utils';
import { getLocationTypes } from '../../utils/Map/getLocationTypes';
import { MapComponent } from '../Map';
import Sketch from '../AddEntry/Sketch';
import Files from '../AddEntry/Files';
import { EntityDivider } from '../AddEntity/EntityDivider';

type Props = {
  incident: Incident;
  entry: Partial<LogEntry>;
  mentionables: Array<Mentionable>;
  selectedFiles: Array<File>;
  recordings: Array<File>;
  markers: Coordinates[];
  canvasRef: RefObject<Stage | null>;
  sketchLines: Array<SketchLine>;
  errors: ValidationError[];
  onFieldChange: OnFieldChange;
  onFilesSelected: (files: Array<File>) => void;
  onRemoveSelectedFile: (filename: string) => void;
  onRemoveRecording: (recordingName: string) => void;
  onLocationChange: (locationInputType: Partial<TypeOfLocation>) => void;
  setSketchLines: (sketchLines: Array<SketchLine>) => void;
  onMainBackClick: () => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const FormsInputContainer = ({
  incident,
  entry,
  mentionables,
  selectedFiles,
  recordings,
  markers,
  canvasRef,
  sketchLines,
  errors,
  onFieldChange,
  onFilesSelected,
  onRemoveSelectedFile,
  onRemoveRecording,
  onLocationChange,
  setSketchLines,
  onMainBackClick,
  onSubmit,
  onCancel
}: Props) => {
  const formTypes: OptionType[] = useMemo(() => getLogEntryTypes(incident), [incident]);
  const [level, setLevel] = useState<number>(0);
  const [customHeading, setCustomHeading] = useState<string>('');
  const [addingDescription, setAddingDescription] = useState<boolean>(false);
  const [addingDateAndTime, setAddingDateAndTime] = useState<boolean>(false);
  const [addingLocation, setAddingLocation] = useState<boolean>(false);
  const [addingLocationDescription, setAddingLocationDescription] = useState<boolean>(false);
  const [addingLocationCoordinates, setAddingLocationCoordinates] = useState<boolean>(false);
  const [addingAttachments, setAddingAttachments] = useState<boolean>(false);
  const [addingSketch, setAddingSketch] = useState<boolean>(false);
  const [entryDate, setEntryDate] = useState<string>();
  const [entryTime, setEntryTime] = useState<string>();

  const setLevelAndClearState = (level: number) => {
    setLevel(level);
    setAddingDescription(false);
    setAddingDateAndTime(false);
    setAddingLocation(false);
    setAddingAttachments(false);
    setAddingSketch(false);
  };

  const onContentChange = (id: string, json: string, text: string) => {
    onFieldChange(id, { json, text });
  };

  const dispatchOnChange = (d: string | undefined, t: string | undefined) => {
    if (d && t) {
      const parseDate = Date.parse(`${d}T${t}`);
      if (!Number.isNaN(parseDate)) {
        onFieldChange('dateTime', new Date(`${d}T${t}`).toISOString());
      }
    }
  };

  const onDateChange = (value: PickerValue) => {
    const isoDate = value ? Format.isoDate(value?.toISOString()) : undefined;
    setEntryDate(isoDate ?? '');
    dispatchOnChange(isoDate, entryTime);
  };
  const onTimeChange = (value: PickerValue) => {
    const timeString = value ? Format.time(value.toISOString()) : undefined;
    setEntryTime(timeString ?? '');
    dispatchOnChange(entryDate, timeString);
  };

  const getDateValue = () => {
    if (entry.dateTime) {
      return dayjs(new Date(Format.isoDate(entry.dateTime)));
    }
    if (entryDate) {
      return dayjs(new Date(entryDate));
    }

    return null;
  };

  const getTimeValue = () => {
    if (entry.dateTime) {
      return dayjs(new Date(entry.dateTime));
    }
    if (entryTime) {
      const now = new Date();
      return dayjs(new Date(`${Format.isoDate(now.toISOString())}T${entryTime}`));
    }

    return null;
  };

  const onLocationInputTypeChange = (value: string) => {
    if (LocationType.guard(value)) {
      if (value === 'none') return;
      setAddingLocationDescription(value === 'description' || value === 'both');
      setAddingLocationCoordinates(value === 'coordinates' || value === 'both');
      onLocationChange(
        MapUtils.getNewLocation(value as LocationType, (entry.location ?? {}) as FullLocationType)
      );
    }
  };

  const onLocationDescriptionChange = (value: string) => {
    if (value) {
      onLocationChange({
        ...(entry.location ?? ({} as Partial<TypeOfLocation>)),
        description: value
      });
    }
  };

  const handleLocationCoordinatesChange = (value: Coordinates[]) => {
    if (value) {
      onLocationChange({
        ...(entry.location ?? ({} as Partial<TypeOfLocation>)),
        coordinates: value
      });
    }
  };

  const entityOptionData: EntityOptionData[] = [
    {
      id: 'description',
      onClick: () => {
        setCustomHeading('Add a description');
        setAddingDescription(true);
        setLevel(2);
      },
      value: entry?.content?.text ? entry.content.text : undefined,
      supportedOffline: true
    },
    {
      id: 'dateAndTime',
      onClick: () => {
        setCustomHeading('Add date and time');
        setAddingDateAndTime(true);
        setLevel(2);
      },
      value: entry.dateTime
        ? `${Format.date(entry.dateTime)} @ ${Format.time(entry.dateTime)}`
        : undefined,
      supportedOffline: true
    },
    {
      id: 'location',
      onClick: () => {
        setCustomHeading('Add location(s)');
        setAddingLocation(true);
        setLevel(2);
      },
      value: entry.location ? 'View location(s)' : undefined,
      required: LogEntryTypes[entry.type as LogEntryType].requireLocation
    },
    {
      id: 'attachments',
      onClick: () => {
        setAddingAttachments(true);
        setLevel(2);
      },
      value: entry.attachments ? `${entry.attachments.length} attachments` : undefined,
      supportedOffline: true
    },
    {
      id: 'sketch',
      onClick: () => {
        setAddingSketch(true);
        setLevel(2);
      },
      value: entry.attachments?.find((attachment) => attachment.type === 'Sketch')
        ? 'View sketch'
        : undefined,
      supportedOffline: true
    }
  ];
  const inputContainerData: EntityInputContainerData[] = [
    {
      heading: 'Select form',
      inputControls: (
        <>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              select
              value={entry.type}
              variant="filled"
              label={entry.type ? '' : 'Select'}
              onChange={(event) => {
                onFieldChange('type', event.target.value);
                setLevel(1);
              }}
              slotProps={{ inputLabel: { shrink: false } }}
            >
              {formTypes.map((formType) => (
                <MenuItem key={`key-${formType.value}`} value={formType.value}>
                  {formType.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <EntityDivider />
        </>
      )
    },
    {
      heading: `Add form - ${entry.type}`,
      inputControls: (
        <>
          <Box display="flex">
            <CircleIcon sx={{ opacity: 0 }} />
            <Typography variant="body1" padding={1}>
              {entry.type}
            </Typography>
          </Box>
          <EntityDivider />
          <EntityOptionsContainer entityType="forms" data={entityOptionData} errors={errors} />
        </>
      )
    },
    {
      heading: customHeading,
      inputControls: (
        <>
          {addingDescription && (
            <Box flexGrow={1}>
              <EntryContent
                id="content"
                editable
                json={typeof entry.content === 'object' ? entry.content.json : undefined}
                recordingActive={false}
                onRecording={undefined}
                onChange={onContentChange}
                error={false}
                mentionables={mentionables}
              />
            </Box>
          )}
          {addingDateAndTime && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" flexDirection="column" flexGrow={1} gap={4} marginTop={2}>
                <FormControl variant="standard">
                  <DatePicker
                    label="Date"
                    slotProps={{ textField: { variant: 'filled', hiddenLabel: true } }}
                    disableFuture
                    value={getDateValue()}
                    onChange={onDateChange}
                  />
                </FormControl>
                <FormControl>
                  <TimePicker
                    label="Time"
                    slotProps={{ textField: { variant: 'filled', hiddenLabel: true } }}
                    viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock }}
                    value={getTimeValue()}
                    onChange={onTimeChange}
                  />
                </FormControl>
              </Box>
            </LocalizationProvider>
          )}
          {addingLocation && (
            <Box flexGrow={1}>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <TextField
                  select
                  aria-label="Select location input type"
                  value={entry.location?.type}
                  onChange={(event) => onLocationInputTypeChange(event.target.value)}
                  id="location.type"
                  variant="filled"
                  label={entry.location?.type ? '' : 'Select location type'}
                  slotProps={{ inputLabel: { shrink: false } }}
                  sx={{
                    '&. MuiInputBase-input': {
                      backgroundColor: '#FFFFFF',
                      paddingTop: '17px',
                      paddingBottom: '16px'
                    }
                  }}
                >
                  {getLocationTypes().map((locationType) => (
                    <MenuItem key={`location-${locationType.value}`} value={locationType.value}>
                      {locationType.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
              {addingLocationDescription && (
                <FormControl fullWidth sx={{ marginTop: 2 }}>
                  <TextField
                    hiddenLabel
                    variant="filled"
                    multiline
                    id="location.description"
                    value={
                      entry.location?.type === 'description' || entry.location?.type === 'both'
                        ? entry.location.description
                        : null
                    }
                    onChange={(event) => onLocationDescriptionChange(event.target.value)}
                    minRows={4}
                    placeholder="Describe the location"
                  />
                </FormControl>
              )}
              {addingLocationCoordinates && (
                <Box marginTop={2}>
                  <MapComponent
                    id="location.coordinates"
                    markers={markers}
                    setMarkers={handleLocationCoordinatesChange}
                  />
                </Box>
              )}
            </Box>
          )}
          {addingAttachments && (
            <Box>
              <Files.Content
                active={addingAttachments}
                selectedFiles={selectedFiles}
                recordings={recordings}
                onFilesSelected={onFilesSelected}
                removeSelectedFile={onRemoveSelectedFile}
                removeRecording={onRemoveRecording}
              />
            </Box>
          )}
          {addingSketch && (
            <Box>
              <Sketch.Content
                active={addingSketch}
                canvasRef={canvasRef}
                lines={sketchLines}
                onChangeLines={setSketchLines}
              />
            </Box>
          )}
        </>
      ),
      hideButtons: true
    }
  ];

  return (
    <EntityInputContainer
      data={inputContainerData}
      onMainBackClick={onMainBackClick}
      onSubmit={onSubmit}
      onCancel={onCancel}
      level={level}
      setLevel={setLevelAndClearState}
      disableSubmit={errors.length > 0}
    />
  );
};
