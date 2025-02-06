// Global imports
import parse from 'html-react-parser';
import { useEffect, useMemo, useState } from 'react';
import { ReactMic } from 'react-mic';

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
  active: boolean;
  entry: Partial<LogEntry>;
  entries: Array<Partial<LogEntry>> | undefined;
  incident: Incident;
  mentionables: Array<Mentionable>;
  validationErrors: Array<ValidationError>;
  onFieldChange: OnFieldChange;
  onAddRecording: (recording: File) => void;
}

export default function FormContent({
  active,
  entry,
  entries,
  incident,
  mentionables,
  validationErrors,
  onFieldChange,
  onAddRecording
}: Props) {
  const [recording, setRecording] = useState(false);
  const [noContent, setNoContent] = useState<boolean>(false);
  const [description, setDescription] = useState<string | undefined>();
  const [descriptionLabel, setDescriptionLabel] = useState<string>('Description');
  const [fields, setFields] = useState<Array<Field>>([]);
  const [groups, setGroups] = useState<Array<FieldGroup>>([]);
  const [speechToTextActive, setSpeechToTextActive] = useState<boolean>(false);
  const [processedRecordings, setProcessedRecordings] = useState<Array<string>>([]);

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

  const addAudioElement = async (blob: Blob) => {
    const blobHash = await Document.getBlobHash(blob);
    if (!processedRecordings.includes(blobHash)) {
      const name = `Recording ${Format.timestamp()}.webm`;
      onAddRecording(new File([blob], name, { type: 'audio/webm' }));
      setProcessedRecordings((prev) => [...prev, blobHash]);
    }
  };

  const classes = bem('add-entry-tab', [active ? 'active' : ''], 'form');

  return (
    <ul className={classes()}>
      {baseFields.map((field) => (
        <FormField
          key={field.id}
          field={{ ...field, value: entry[field.id as keyof LogEntry] as string }}
          entries={entries}
          error={validationErrors.find((e) => e.fieldId === field.id)}
          onChange={onFieldChange}
          className={field.className}
        />
      ))}
      {description && <li className="full-width">{parse(description)}</li>}
      {!noContent && (
        <li className={`full-width field-type--Lexical ${contentError ? 'in-error' : ''}`}>
          <label htmlFor="content">
            {descriptionLabel}
            <EntryContent
              id="content"
              json={typeof entry.content === 'object' ? entry.content.json : undefined}
              editable
              mentionables={mentionables}
              speechToTextActive={speechToTextActive}
              onChange={onContentChange}
              onSpeechToText={onSpeechToTextChange}
            />
          </label>
          {contentError && <div className="field-error">{contentError.error}</div>}

          <div className="recorder-controls">
            <ReactMic
              record={recording}
              className="sound-wave"
              onStop={(recordedBlob) => addAudioElement(recordedBlob.blob)}
              onData={(chunk) => console.log('Recording chunk:', chunk)}
              mimeType="audio/webm"
              strokeColor="#000000"
              backgroundColor="#FF5733"
            />
            <button onClick={() => setRecording(true)}>Start Recording</button>
            <button onClick={() => setRecording(false)}>Stop Recording</button>
          </div>
        </li>
      )}
      <FormFields
        fields={fields}
        validationErrors={validationErrors}
        groups={groups}
        entry={entry}
        entries={entries}
        onFieldChange={onNestedFieldChange}
      />
    </ul>
  );
}
