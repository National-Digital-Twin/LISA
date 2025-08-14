import { LogEntry } from 'common/LogEntry';
import { useEffect, useMemo, useRef, useState, MouseEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enGB } from 'date-fns/locale';
import { v4 as uuidV4 } from 'uuid';
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Typography,
  TextField,
  useTheme,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DrawIcon from '@mui/icons-material/Draw';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LocalizationProvider,
  DatePicker,
  renderTimeViewClock,
  TimePicker
} from '@mui/x-date-pickers';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { Stage } from 'konva/lib/Stage';
import { LogEntryType } from 'common/LogEntryType';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { Coordinates, LocationType, type Location as TypeOfLocation } from 'common/Location';
import { FieldOption, type Field } from 'common/Field';
import { Mentionable } from 'common/Mentionable';
import { LogEntryAttachment } from 'common/LogEntryAttachment';
import { createSequenceNumber } from '../utils/Form/sequence';
import { useCreateLogEntry, useIncidents, useLogEntries, useUsers } from '../hooks';
import { Document, Format, Form as FormUtils, MapUtils, Validate } from '../utils';
import {
  FullLocationType,
  SketchLine,
  type FieldValueType,
  type OptionType,
  type ValidationError
} from '../utils/types';
import EntryContent from '../components/lexical/EntryContent';
import { getSortedEntriesWithDisplaySequence } from '../utils/sortEntries';
import { useAttachments } from '../hooks/useAttachments';
import { getLocationTypes } from '../utils/Map/getLocationTypes';
import { MapComponent } from '../components/Map';
import Files from '../components/AddEntry/Files';
import Sketch from '../components/AddEntry/Sketch';
import { getFieldValue } from '../utils/Form/getFieldValue';
import { OnCreateEntry } from '../utils/handlers';
import PageWrapper from '../components/PageWrapper';

const LogbookV2 = () => {
  const { incidentId } = useParams();
  const query = useIncidents();
  const incident = query?.data?.find((inc) => inc.id === incidentId);
  const { logEntries } = useLogEntries(incidentId);
  const { attachments: incidentAttachments } = useAttachments(incident?.id);
  const { users } = useUsers();
  const navigate = useNavigate();
  const { createLogEntry } = useCreateLogEntry(incidentId, () =>
    navigate(`/logbook/${incidentId}`)
  );

  const [entry, setEntry] = useState<Partial<LogEntry>>({
    incidentId,
    sequence: createSequenceNumber(),
    type: 'General',
    content: {}
  });
  const baseOptions: Array<OptionType> = useMemo(
    () => FormUtils.getLogEntryTypes(incident),
    [incident]
  );
  const [formType, setFormType] = useState<LogEntryType>();
  const [locationInputType, setLocationInputType] = useState<LocationType>();
  const [validationErorrs, setValidationErrors] = useState<Array<ValidationError>>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [recordings, setRecordings] = useState<File[]>([]);
  const [addingFormContent, setAddingFormContent] = useState<boolean>(false);
  const [addingDescription, setAddingDescription] = useState<boolean>(false);
  const [addingFormFields, setAddingFormFields] = useState<boolean>(false);
  const [addingDateAndTime, setAddingDateAndTime] = useState<boolean>(false);
  const [addingLocation, setAddingLocation] = useState<boolean>(false);
  const [addingLocationDescription, setAddingLocationDescription] = useState<boolean>(false);
  const [addingLocationCoordinates, setAddingLocationCoordinates] = useState<boolean>(false);
  const [addingAttachments, setAddingAttachments] = useState<boolean>(false);
  const [addingSketch, setAddingSketch] = useState<boolean>(false);
  const [sketchLines, setSketchLines] = useState<SketchLine[]>([]);
  const canvasRef = useRef<Stage>(null);
  const [heading, setHeading] = useState<string>('New form');
  const [onBackClick, setOnBackClick] = useState<(() => () => void) | undefined>(undefined);
  const [date, setDate] = useState<string>(entry.dateTime ? Format.isoDate(entry.dateTime) : '');
  const [time, setTime] = useState<string>(entry.dateTime ? Format.time(entry.dateTime) : '');
  const [fields, setFields] = useState<Field[]>();
  const [field, setField] = useState<Field>();
  const [dependent, setDependent] = useState<Field>();

  useEffect(() => {
    entry.type = formType;
  }, [entry, formType]);

  useEffect(() => {
    setFields(LogEntryTypes[formType as LogEntryType]?.fields(entry));
  }, [formType, entry]);

  useEffect(() => {
    setValidationErrors(Validate.entry(entry, [...selectedFiles, ...recordings]));
  }, [setValidationErrors, entry, selectedFiles, recordings]);

  const theme = useTheme();

  const onFieldChange = (id: string, value: FieldValueType, nested = false) => {
    setEntry((prev) => {
      let updated = FormUtils.updateLogEntry(prev, id, value, nested);
      if (nested) {
        const changedField = updated.fields?.find((f) => f.id === id);
        if (changedField?.type === 'SelectLogEntry') {
          // We need to populate this log entry from the one that's been selected.
          const selection = logEntries?.find((e) => e.id === changedField.value);
          if (selection) {
            updated = FormUtils.copyIntoLogEntry(updated, selection);
          }
        }
      }
      return updated;
    });
  };

  const onLocationChange = (location: Partial<TypeOfLocation>) => {
    setEntry((prev) => ({ ...prev, location }) as LogEntry);
  };

  const handleFormTypeChange = (value: string) => {
    if (LogEntryType.guard(value)) {
      setFormType(value);
    }
    onFieldChange('type', formType, false);
  };

  const handleLocationInputTypeChange = (value: string) => {
    if (LocationType.guard(value)) {
      setLocationInputType(value);

      if (value === 'none') return;
      setAddingLocationDescription(value === 'description' || value === 'both');
      setAddingLocationCoordinates(value === 'coordinates' || value === 'both');
      onLocationChange(
        MapUtils.getNewLocation(value as LocationType, (entry.location ?? {}) as FullLocationType)
      );
    }
  };

  const handleLocationDescriptionChange = (value: string) => {
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

  const markers = useMemo(() => {
    if (!entry.location || entry.location.type === 'none' || entry.location.type === 'description')
      return [];
    if ('coordinates' in entry.location && entry.location.coordinates) {
      return Array.isArray(entry.location.coordinates)
        ? entry.location.coordinates
        : [entry.location.coordinates];
    }
    return [];
  }, [entry.location]);

  useEffect(() => {
    if (formType) {
      setHeading(`New form - ${formType}`);
    }
    if (addingDescription) {
      setHeading('Add description');
    } else if (addingDateAndTime) {
      setHeading('Add date and time');
    } else if (addingLocation) {
      setHeading('Add location');
    } else if (addingAttachments) {
      setHeading('Add attachments(s)');
    } else if (addingSketch) {
      setHeading('Add sketch');
    } else if (addingFormFields && field) {
      setHeading('Add field');
    }
  }, [
    formType,
    setHeading,
    addingDescription,
    addingDateAndTime,
    addingLocation,
    addingAttachments,
    addingSketch,
    addingFormFields,
    field
  ]);

  const onContentChange = (id: string, json: string, text: string) => {
    onFieldChange(id, { json, text });
  };

  const onNestedFieldChange = (id: string, value: FieldValueType) => {
    onFieldChange(id, value, true);
  };

  const otherAttachments: Array<Mentionable> = useMemo(() => {
    if (!incidentAttachments) {
      return [];
    }
    return incidentAttachments.map(Format.mentionable.attachment);
  }, [incidentAttachments]);

  const mentionables: Array<Mentionable> = useMemo(
    () => [
      ...(getSortedEntriesWithDisplaySequence(false, logEntries ?? [])?.map((e) =>
        Format.mentionable.entry(e)
      ) ?? []),
      ...(users?.map(Format.mentionable.user) ?? []),
      ...selectedFiles.map((file) =>
        Format.mentionable.attachment({ name: file.name, type: 'File' })
      ),
      ...recordings.map((file) => Format.mentionable.attachment({ name: file.name, type: 'File' })),
      ...otherAttachments
    ],
    [logEntries, users, selectedFiles, recordings, otherAttachments]
  );

  useEffect(() => {
    setAddingFormContent(
      addingDescription ||
        addingFormFields ||
        addingDateAndTime ||
        addingLocation ||
        addingAttachments ||
        addingSketch
    );
  }, [
    setAddingFormContent,
    addingDescription,
    addingFormFields,
    addingDateAndTime,
    addingLocation,
    addingAttachments,
    addingSketch
  ]);

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
    setDate(isoDate ?? '');
    dispatchOnChange(isoDate, time);
  };
  const onTimeChange = (value: PickerValue) => {
    const timeString = value ? Format.time(value.toISOString()) : undefined;
    setTime(timeString ?? '');
    dispatchOnChange(date, timeString);
  };

  const getDateValue = () => {
    if (entry.dateTime) {
      return new Date(Format.isoDate(entry.dateTime));
    }
    if (date) {
      return new Date(date);
    }

    return null;
  };

  const getTimeValue = () => {
    if (entry.dateTime) {
      return new Date(entry.dateTime);
    }
    if (time) {
      const now = new Date();
      return new Date(`${Format.isoDate(now.toISOString())}T${time}`);
    }

    return null;
  };

  const getUniqueFiles = (newFiles: File[], existingFiles: File[]): File[] =>
    newFiles.filter(
      (file) => !existingFiles.some((existingFile) => existingFile.name === file.name)
    );

  const onFilesSelect = (files: File[]): void => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...getUniqueFiles(files, prevFiles)]);
  };

  const removeSelectedFile = (name: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== name));
  };

  const removeRecording = (name: string) => {
    setRecordings((prev) => prev.filter((r) => r.name !== name));
  };

  const dependentFieldIds = fields
    ?.flatMap((field) => field.dependentFieldIds)
    ?.filter((fieldId) => fieldId);
  const parentFields = fields?.filter((field) => !dependentFieldIds?.includes(field.id));

  useEffect(() => {
    const matchingDependent = fields?.find((field1) =>
      field?.dependentFieldIds?.includes(field1.id)
    );
    setDependent(matchingDependent);
  }, [fields, field, setDependent]);

  const onCreateEntry: OnCreateEntry = (entry, files) => {
    createLogEntry({ logEntry: { id: uuidV4(), ...entry }, attachments: files });
    return undefined;
  };

  const onAddEntryClick = (evt?: MouseEvent<HTMLButtonElement>) => {
    evt?.preventDefault();
    const fileAttachments: LogEntryAttachment[] = selectedFiles.map((file) => ({
      type: 'File',
      name: file.name
    }));
    const recordingAttachments: LogEntryAttachment[] = recordings.map((recording) => ({
      type: 'Recording',
      name: recording.name
    }));
    const sketchAttachments: LogEntryAttachment[] = [];
    const sketches: File[] = [];
    if (sketchLines.length > 0) {
      const dataURL = canvasRef.current?.toDataURL();
      if (dataURL) {
        const file = Document.dataURLtoFile(dataURL, `Sketch ${Format.timestamp()}.png`);
        sketchAttachments.push({ type: 'Sketch', name: file.name });
        sketches.push(file);
      }
    }
    const attachments = [...fileAttachments, ...recordingAttachments, ...sketchAttachments];
    entry.attachments = attachments.length > 0 ? attachments : undefined;

    onCreateEntry({ ...entry } as LogEntry, [...selectedFiles, ...recordings, ...sketches]);
  };

  if (!incident) return null;

  const formComponents = (fields: Array<Field>) => {
    const descriptionComponent = (
      <>
        <Box
          display="flex"
          textAlign="center"
          gap={1}
          padding="10px 5px"
          onClick={() => {
            setAddingDescription(true);
            setOnBackClick(() => () => setAddingDescription(false));
          }}
          sx={{ cursor: 'pointer' }}
        >
          <TextSnippetIcon />
          <Typography
            component="span"
            sx={{
              color: validationErorrs.find(
                (validationError) => validationError.fieldId === 'content'
              )
                ? 'red'
                : 'initial'
            }}
          >
            Add a description
          </Typography>
        </Box>
        <Divider />
      </>
    );
    const dateAndTimeComponent = (
      <>
        <Box
          display="flex"
          textAlign="center"
          gap={1}
          padding="10px 5px"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            setAddingDateAndTime(true);
            setOnBackClick(() => () => setAddingDateAndTime(false));
          }}
        >
          <AccessTimeIcon />
          <Typography
            component="span"
            sx={{
              color: validationErorrs.find(
                (validationError) => validationError.fieldId === 'dateTime'
              )
                ? 'red'
                : 'initial'
            }}
          >
            Add date and time
          </Typography>
        </Box>
        <Divider />
      </>
    );
    const locationComponent = (
      <>
        <Box
          display="flex"
          textAlign="center"
          gap={1}
          padding="10px 5px"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            setAddingLocation(true);
            setOnBackClick(() => () => setAddingLocation(false));
          }}
        >
          <LocationOnIcon />
          <Typography
            component="span"
            sx={{
              color: LogEntryTypes[formType as LogEntryType].requireLocation ? 'red' : 'initial'
            }}
          >
            Add location(s)
          </Typography>
        </Box>
        <Divider />
      </>
    );
    const attachmentsComponent = (
      <>
        <Box
          display="flex"
          textAlign="center"
          gap={1}
          padding="10px 5px"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            setAddingAttachments(true);
            setOnBackClick(() => () => setAddingAttachments(false));
          }}
        >
          <AttachFileIcon />
          <Typography component="span">Add attachment(s)</Typography>
        </Box>
        <Divider />
      </>
    );
    const sketchComponent = (
      <>
        <Box
          display="flex"
          textAlign="center"
          gap={1}
          padding="10px 5px"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            setAddingSketch(true);
            setOnBackClick(() => () => setAddingSketch(false));
          }}
        >
          <DrawIcon />
          <Typography component="span">Add sketch</Typography>
        </Box>
        <Divider />
      </>
    );
    const fieldComponents = fields.map((field) => (
      <>
        <Box
          key={`field-${field.id}`}
          display="flex"
          textAlign="center"
          gap={1}
          padding="10px 5px"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            setField(field);
            setAddingFormFields(true);
            setOnBackClick(() => () => {
              setAddingFormFields(false);
            });
          }}
        >
          {FormUtils.getFieldIcon(field)?.icon}
          <Box display="flex" flexDirection="column">
            <Typography
              component="span"
              sx={{
                color: validationErorrs.find(
                  (validationError) => validationError.fieldId === field.id
                )
                  ? 'red'
                  : 'initial'
              }}
            >
              {field.label}
            </Typography>
          </Box>
        </Box>
        <Divider />
      </>
    ));

    return [
      descriptionComponent,
      ...fieldComponents,
      dateAndTimeComponent,
      locationComponent,
      attachmentsComponent,
      sketchComponent
    ];
  };

  return (
    <PageWrapper>
      <Box
        marginLeft={1}
        marginRight={1}
        display="flex"
        flexDirection="column"
        position="relative"
        height="95%"
      >
        <Box display="flex" gap={1} alignItems="center">
          <IconButton aria-label="back" sx={{ paddingLeft: 0 }} onClick={onBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h1">{heading}</Typography>
        </Box>
        <Divider />
        {addingDescription && (
          <Box flexGrow={1} sx={{ backgroundColor: '#f0f2f2' }}>
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
        {addingFormFields && field && (
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            gap={4}
            marginTop={2}
            sx={{ backgroundColor: '#f0f2f2' }}
          >
            {field.type && field.type === 'Select' && (
              <FormControl fullWidth>
                <TextField
                  select
                  aria-label="Commicated by option"
                  value={getFieldValue(field, entry)}
                  onChange={(event) => {
                    setField(field);
                    onNestedFieldChange(field.id, event.target.value);
                  }}
                  id={field.id}
                  label={getFieldValue(field, entry) ? '' : 'Select'}
                  slotProps={{ inputLabel: { shrink: false } }}
                  sx={{
                    '&. MuiInputBase-input': {
                      backgroundColor: '#FFFFFF',
                      paddingTop: '17px',
                      paddingBottom: '16px'
                    }
                  }}
                >
                  {field.options!.map((option: FieldOption) => (
                    <MenuItem value={option.value}>{option.label}</MenuItem>
                  ))}
                </TextField>
              </FormControl>
            )}
            {field.type && field.type === 'Input' && (
              <FormControl fullWidth>
                <TextField
                  hiddenLabel
                  value={getFieldValue(field, entry)}
                  onChange={(event) => {
                    setField(field);
                    onNestedFieldChange(field.id, event.target.value);
                  }}
                  id={field.id}
                  variant="filled"
                />
              </FormControl>
            )}
            {dependent && (
              <>
                {dependent.type && dependent.type === 'Select' && (
                  <FormControl fullWidth>
                    <TextField
                      select
                      aria-label={dependent.label}
                      value={getFieldValue(dependent, entry)}
                      onChange={(event) => {
                        onNestedFieldChange(dependent.id, event.target.value);
                      }}
                      id={dependent.id}
                      label={getFieldValue(dependent, entry) ? '' : 'Select'}
                      slotProps={{ inputLabel: { shrink: false } }}
                      sx={{
                        '&. MuiInputBase-input': {
                          backgroundColor: '#FFFFFF',
                          paddingTop: '17px',
                          paddingBottom: '16px'
                        }
                      }}
                    >
                      {dependent.options!.map((option: FieldOption) => (
                        <MenuItem value={option.value}>{option.label}</MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                )}
                {dependent.type && dependent.type === 'Input' && (
                  <FormControl fullWidth>
                    <TextField
                      hiddenLabel
                      value={getFieldValue(dependent, entry)}
                      onChange={(event) => {
                        onNestedFieldChange(dependent.id, event.target.value);
                      }}
                      id={dependent.id}
                      variant="filled"
                    />
                  </FormControl>
                )}
              </>
            )}
          </Box>
        )}
        {addingDateAndTime && (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <Box
              display="flex"
              flexDirection="column"
              flexGrow={1}
              gap={4}
              marginTop={2}
              sx={{ backgroundColor: '#f0f2f2' }}
            >
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
          <Box flexGrow={1} sx={{ backgroundColor: '#f0f2f2' }}>
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <TextField
                select
                aria-label="Select location input type"
                value={locationInputType}
                onChange={(event) => handleLocationInputTypeChange(event.target.value)}
                id="location.type"
                variant="filled"
                label={locationInputType ? '' : 'Select location type'}
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
                  onChange={(event) => handleLocationDescriptionChange(event.target.value)}
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
          <Box sx={{ backgroundColor: '#f0f2f2' }}>
            <Files.Content
              active={addingAttachments}
              selectedFiles={selectedFiles}
              recordings={recordings}
              onFilesSelected={onFilesSelect}
              removeSelectedFile={removeSelectedFile}
              removeRecording={removeRecording}
            />
          </Box>
        )}
        {addingSketch && (
          <Box sx={{ backgroundColor: '#f0f2f2' }}>
            <Sketch.Content
              active={addingSketch}
              canvasRef={canvasRef}
              lines={sketchLines}
              onChangeLines={setSketchLines}
            />
          </Box>
        )}
        {!addingFormContent && (
          <Box display="flex" flexDirection="column" marginTop={1} flexGrow={1}>
            <Box flexGrow={1}>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <TextField
                  select
                  value={formType}
                  onChange={(event) => handleFormTypeChange(event.target.value)}
                  aria-label="Select form type"
                  id="select-form-type"
                  variant="standard"
                  sx={{ marginLeft: 1, marginRight: 1, color: theme.palette.secondary.main }}
                  label={formType ? '' : 'Select form'}
                  slotProps={{ inputLabel: { shrink: false } }}
                >
                  {baseOptions.map((baseOption) => (
                    <MenuItem key={`formType-${baseOption.value}`} value={baseOption.value}>
                      {baseOption.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
              <Divider />
              {parentFields && formComponents(parentFields ?? [])}
            </Box>
            <Box display="flex" alignSelf="flex-end" gap={1} alignItems="end">
              <Button variant="outlined" href={`/logbook/${incidentId}`}>
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<ImportContactsIcon />}
                disabled={validationErorrs.length > 0}
                onClick={onAddEntryClick}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </PageWrapper>
  );
};

export default LogbookV2;
