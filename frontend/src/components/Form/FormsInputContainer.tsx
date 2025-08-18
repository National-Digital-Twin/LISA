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
import { type Location as TypeOfLocation } from 'common/Location';
import { FieldValueType, OptionType, SketchLine, ValidationError } from '../../utils/types';
import { EntityInputContainer, EntityInputContainerData } from '../AddEntity/EntityInputContainer';
import { getLogEntryTypes } from '../../utils/Form/getBaseLogEntryFields';
import { EntityOptionsContainer } from '../AddEntity/EntityOptionsContainer';
import { EntityOptionData } from '../AddEntity/EntityOptions';
import { OnFieldChange } from '../../utils/handlers';
import EntryContent from '../lexical/EntryContent';

import { Format } from '../../utils';
import Sketch from '../AddEntry/Sketch';
import Files from '../AddEntry/Files';
import { EntityDivider } from '../AddEntity/EntityDivider';
import Location from '../AddEntry/Location';
import { getFieldValue } from '../../utils/Form/getFieldValue';
import { getFieldIcon } from '../../utils/Form/getFieldIcon';
import { Field } from 'common/Field';
import { FormFieldWithDependent } from './FormFieldWithDependent';
import { CommunicationMethod } from 'common/Fields/CommunicationMethod';

type Props = {
  incident: Incident;
  entries: Array<LogEntry>;
  entry: Partial<LogEntry>;
  formFields: Array<Field>;
  mentionables: Array<Mentionable>;
  selectedFiles: Array<File>;
  recordings: Array<File>;
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
  entries,
  entry,
  formFields,
  mentionables,
  selectedFiles,
  recordings,
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
  const [addingFormFields, setAddingFormFields] = useState<boolean>(false);
  const [addingDateAndTime, setAddingDateAndTime] = useState<boolean>(false);
  const [addingLocation, setAddingLocation] = useState<boolean>(false);
  const [addingAttachments, setAddingAttachments] = useState<boolean>(false);
  const [addingSketch, setAddingSketch] = useState<boolean>(false);
  const [entryDate, setEntryDate] = useState<string>();
  const [entryTime, setEntryTime] = useState<string>();
  const [formField, setFormField] = useState<Field>();

  const setLevelAndClearState = (level: number) => {
    setLevel(level);
    setAddingDescription(false);
    setAddingFormFields(false);
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

  const onNestedFieldChange = (id: string, value: FieldValueType) => {
    onFieldChange(id, value, true);
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

  const getFormattedValueForField = (field: Field, value: FieldValueType) => {
    if (field.id === 'CommunicationMethod') {
      return CommunicationMethod?.options?.find((option) => option.value === value)?.label ?? value;
    }

    return value;
  };

  const dependentFieldIds = formFields.map((formField) => formField.dependentFieldId);
  const parentFormFields = formFields.filter(
    (formField) => !dependentFieldIds.includes(formField.id)
  );

  const entityOptionsData: EntityOptionData[] = [
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
    ...parentFormFields.map(
      (field) =>
        ({
          id: `field-${field.id}`,
          dependentId: field.dependentFieldId,
          onClick: () => {
            setCustomHeading('Add field');
            setAddingFormFields(true);
            setFormField(field);
            setLevel(2);
          },
          value: getFormattedValueForField(
            field,
            getFieldValue(
              formFields.find((formField) => field.dependentFieldId === formField.id) ?? field,
              entry
            )
          ),
          label: field.label,
          icon: getFieldIcon(field)?.icon,
          supportedOffline: true
        }) as EntityOptionData
    ),
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
      value: selectedFiles.length > 0 ? `${selectedFiles.length} attachments` : undefined,
      supportedOffline: true
    },
    {
      id: 'sketch',
      onClick: () => {
        setAddingSketch(true);
        setLevel(2);
      },
      value: sketchLines.length > 0 ? 'View sketch' : undefined,
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
          <EntityOptionsContainer entityType="forms" data={entityOptionsData} errors={errors} />
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
          {addingFormFields && formFields && formField && (
            <Box flexGrow={1}>
              <FormFieldWithDependent
                mainFormField={{ field: formField }}
                dependentFormField={{
                  field: formFields.find((x) => x.id === formField.dependentFieldId)
                }}
                entry={entry}
                entries={entries}
                onChange={onNestedFieldChange}
                errors={errors}
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
              <Location.Content
                location={entry.location}
                onLocationChange={onLocationChange}
                validationErrors={errors}
                showValidationErrors={errors.length > 0}
                active={addingLocation}
              />
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
