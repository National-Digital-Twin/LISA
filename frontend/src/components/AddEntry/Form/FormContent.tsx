/* eslint-disable no-await-in-loop */
// Global imports
import parse from 'html-react-parser';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Box, InputLabel, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

// Local imports
import { type Field } from 'common/Field';
import { type FieldGroup } from 'common/FieldGroup';
import { type Incident } from 'common/Incident';
import { type LogEntry } from 'common/LogEntry';
import { type LogEntryType } from 'common/LogEntryType';
import { type Mentionable } from 'common/Mentionable';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';
import { bem, Document, Form, Format } from '../../../utils';
import { type OnFieldChange } from '../../../utils/handlers';
import { ValidationError, type FieldValueType } from '../../../utils/types';
import { FormField, FormFields } from '../../Form';
import EntryContent from '../../lexical/EntryContent';

interface Props {
  readonly active: boolean;
  readonly entry: Partial<LogEntry>;
  readonly entries: Array<Partial<LogEntry>> | undefined;
  readonly incident: Incident;
  readonly mentionables: Array<Mentionable>;
  readonly validationErrors: Array<ValidationError>;
  readonly onFieldChange: OnFieldChange;
  readonly onAddRecording: (recording: File) => void;
  readonly showValidationErrors: boolean;
}

export default function FormContent({
  active,
  entry,
  entries,
  incident,
  mentionables,
  validationErrors,
  onFieldChange,
  onAddRecording,
  showValidationErrors
}: Props) {
  const [recording, setRecording] = useState(false);
  const [noContent, setNoContent] = useState<boolean>(false);
  const [description, setDescription] = useState<string | undefined>();
  const [descriptionLabel, setDescriptionLabel] = useState<string>('Description');
  const [fields, setFields] = useState<Array<Field>>([]);
  const [groups, setGroups] = useState<Array<FieldGroup>>([]);
  const [speechToTextActive, setSpeechToTextActive] = useState<boolean>(false);
  const [processedRecordings, setProcessedRecordings] = useState<Array<string>>([]);
  const hasStoppedRef = useRef(false);

  const baseFields: Array<Field> = useMemo(
    () => Form.getBaseLogEntryFields(incident, entry),
    [incident, entry]
  );
  const contentError: ValidationError | undefined = useMemo(
    () => Form.getError({ id: 'content' }, validationErrors),
    [validationErrors]
  );

  useEffect(() => {
    const type = LogEntryTypes[entry.type as LogEntryType];
    setNoContent(type ? (type.noContent ?? false) : true);
    setDescriptionLabel(type?.descriptionLabel ?? 'Description');
    setDescription(type?.description);
    setFields(type?.fields(entry) ?? []);
    setGroups(type?.groups ?? []);
  }, [entry]);

  const onNestedFieldChange = (id: string, value: FieldValueType) => {
    onFieldChange(id, value, true);
  };

  const onContentChange = (id: string, json: string, text: string) => {
    onFieldChange(id, { json, text });
  };

  const onSpeechToTextChange = (isActive: boolean) => {
    setSpeechToTextActive(isActive);
    setRecording(isActive);
  };

  const addAudioElement = useCallback(
    async (blob: Blob) => {
      const blobHash = await Document.getBlobHash(blob);
      if (!processedRecordings.includes(blobHash)) {
        const name = `Recording ${Format.timestamp()}.webm`;
        onAddRecording(new File([blob], name, { type: 'audio/webm' }));
        setProcessedRecordings((prev) => [...prev, blobHash]);
      }
    },
    [processedRecordings, onAddRecording]
  );

  // Function to check if the blob size is stable over time
  async function isBlobStable(blob: Blob, delay: number) {
    const initialSize = blob.size;
    await new Promise((resolve) => { setTimeout(resolve, delay) });

    const response = await fetch(URL.createObjectURL(blob));
    const newBlob = await response.blob();

    // Blob is stable if size hasn't changed
    return newBlob.size === initialSize;
  }

  // Function to wait for a finalised Blob
  async function fetchFinalisedBlob(blobUrl: string, maxRetries = 5, delay = 1000) {
    for (let i = 0; i < maxRetries; i += 1) {
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      if (i === maxRetries - 1 || await isBlobStable(blob, delay)) {
        return blob;
      }

      await new Promise((resolve) => { setTimeout(resolve, delay) });
    }
    throw new Error("Failed to retrieve complete blob");
  }

  // Set up react-media-recorder hook
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    // When recording stops, fetch the blob and pass it along
    onStop: async (blobUrl) => {
      if (!hasStoppedRef.current) {
        hasStoppedRef.current = true;

        // Wait for the browser to finalise the blob before fetching
        const finalisedBlob = await fetchFinalisedBlob(blobUrl);
        await addAudioElement(finalisedBlob);
      }
    }
  });

  // Start or stop recording based on the `recording` state
  useEffect(() => {
    if (recording) {
      hasStoppedRef.current = false
      startRecording();
    } else {
      stopRecording();
    }
  }, [recording, startRecording, stopRecording]);

  const classes = bem('add-entry-tab', [active ? 'active' : ''], 'form');

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Grid component="ul" container spacing={4} className={classes()}>
        {baseFields.map((field) => (
          <Grid key={field.id} component="li" size={{ xs: 12, md: 6 }}>
            <FormField
              component="li"
              key={field.id}
              field={{ ...field, value: entry[field.id as keyof LogEntry] as string }}
              entries={entries}
              error={showValidationErrors ? Form.getError(field, validationErrors) : undefined}
              onChange={onFieldChange}
              className={field.className}
            />
          </Grid>
        ))}
      </Grid>
      {description && <li className="full-width">{parse(description)}</li>}
      {!noContent && (
        <Box
          display="flex"
          flexDirection="column"
          component="li"
          gap={1}
          className={`full-width field-type--Lexical ${contentError ? 'in-error' : ''}`}
        >
          <InputLabel htmlFor="content" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            {descriptionLabel}
          </InputLabel>
          <EntryContent
            id="content"
            json={typeof entry.content === 'object' ? entry.content.json : undefined}
            editable
            mentionables={mentionables}
            speechToTextActive={speechToTextActive}
            onChange={onContentChange}
            onSpeechToText={onSpeechToTextChange}
            error={Boolean(showValidationErrors && contentError)}
          />
          {showValidationErrors && contentError && (
            <Typography variant="body1" color="error">
              {contentError.error}
            </Typography>
          )}

          <div className="recorder-controls">
            {/* Display a simple indicator and controls for recording */}
            {recording ? (
              <>
                <div className="recording-indicator">Recording in progress...</div>
                <button type="button" onClick={() => setRecording(false)}>
                  Stop Recording
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setRecording(true)}>
                  Start Recording
                </button>
                {/* Optionally, if a recording exists, display an audio preview */}
                {mediaBlobUrl && (
                  <div className="audio-preview">
                    <audio src={mediaBlobUrl} controls aria-label="Audio preview recording">
                      <track kind="captions" />
                    </audio>
                  </div>
                )}
              </>
            )}
          </div>
        </Box>
      )}
      <FormFields
        component="li"
        fields={fields}
        validationErrors={validationErrors}
        groups={groups}
        entry={entry}
        entries={entries}
        onFieldChange={onNestedFieldChange}
        showValidationErrors={showValidationErrors}
      />
    </Box>
  );
}
