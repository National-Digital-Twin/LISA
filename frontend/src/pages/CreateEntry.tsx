import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { useCreateLogEntry, useIncidents, useLogEntries, useUsers } from '../hooks';
import { useAttachments } from '../hooks/useAttachments';
import { useFormTemplates } from '../hooks/Forms/useFormTemplates';
import { useCreateFormInstance } from '../hooks/Forms/useFormInstances';
import { useIsOnline } from '../hooks/useIsOnline';
import { LogEntry } from 'common/LogEntry';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createSequenceNumber } from '../utils/Form/sequence';
import { Form, FormDataProperty } from '../components/CustomForms/FormTemplates/types';
import { Field } from 'common/Field';
import { FieldValueType, SketchLine } from '../utils/types';
import { Stage } from 'konva/lib/Stage';
import { Mentionable } from 'common/Mentionable';
import { Document, Format, Form as FormUtils } from '../utils';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { LogEntryType } from 'common/LogEntryType';
import { Attachment } from 'common/Attachment';
import { OnCreateEntry } from '../utils/handlers';
import { EntryInputContainer } from '../components/AddEntry/EntryInputContainer';
import PageWrapper from '../components/PageWrapper';
import { Location } from 'common/Location';
import { calcMentionables } from '../hooks/useMentionables';

type Props = {
  inputType: 'form' | 'update';
};

export const CreateEntry = ({ inputType }: Props) => {
  const { incidentId } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source');
  const incidents = useIncidents();
  const incident = incidents?.data?.find((inc) => inc.id === incidentId);
  const { logEntries } = useLogEntries(incidentId);
  const { attachments: incidentAttachments } = useAttachments(incident?.id);
  const { users } = useUsers();
  const { forms } = useFormTemplates();
  const navigate = useNavigate();
  const { mutate: createFormInstance } = useCreateFormInstance(incidentId!, () =>
    navigate(`/logbook/${incidentId}`)
  );
  const { createLogEntry } = useCreateLogEntry(incidentId, () =>
    navigate(`/logbook/${incidentId}`)
  );
  const isOnline = useIsOnline();

  const [entry, setEntry] = useState<Partial<LogEntry>>(
    (inputType === 'update' && {
      type: 'Update',
      incidentId,
      sequence: createSequenceNumber(),
      content: {}
    }) || {
      incidentId,
      sequence: createSequenceNumber(),
      content: {}
    }
  );

  const [customForm, setCustomForm] = useState<Form | null>(null);
  const [customFormData, setCustomFormData] = useState<FormDataProperty[]>([]);

  const [formFields, setFormFields] = useState<Field[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [recordings, setRecordings] = useState<File[]>([]);
  const [sketchLines, setSketchLines] = useState<SketchLine[]>([]);
  const canvasRef = useRef<Stage>(null);

  const otherAttachments: Array<Mentionable> = useMemo(() => {
    if (!incidentAttachments) {
      return [];
    }
    return incidentAttachments.map(Format.mentionable.attachment);
  }, [incidentAttachments]);

  const mentionables: Array<Mentionable> = useMemo(
    () =>
      calcMentionables({
        users,
        logEntries,
        files: selectedFiles,
        recordings,
        other: otherAttachments
      }),
    [logEntries, users, selectedFiles, recordings, otherAttachments]
  );

  useEffect(() => {
    if (!isOnline) {
      setEntry((prev) => ({ ...prev, location: undefined }));
    }
  }, [isOnline, setEntry]);

  useEffect(() => {
    if (inputType === 'form' && entry.type) {
      setFormFields(LogEntryTypes[entry.type as LogEntryType].fields(entry));
    }
  }, [inputType, setFormFields, entry]);

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

  const onCustomFormDataChange = (id: string, label: string, value: string | number | boolean) => {
    setCustomFormData((prev) => {
      return [...prev.filter((p) => p.id !== id), { id, label, value }];
    });
  };

  const onLocationChange = (location: Partial<Location>) => {
    if (isOnline) {
      setEntry((prev) => ({ ...prev, location }) as LogEntry);
    }
  };

  const getUniqueFiles = (newFiles: File[], existingFiles: File[]): File[] =>
    newFiles.filter(
      (file) => !existingFiles.some((existingFile) => existingFile.name === file.name)
    );

  const onFilesSelected = (files: File[]): void => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...getUniqueFiles(files, prevFiles)]);
  };

  const onRemoveSelectedFile = (name: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== name));
  };

  const onRemoveRecording = (name: string) => {
    setRecordings((prev) => prev.filter((r) => r.name !== name));
  };

  const onCreateEntry: OnCreateEntry = (entry, files) => {
    createLogEntry({ logEntry: { id: uuidV4(), ...entry }, attachments: files });
    return undefined;
  };

  const onEntrySubmit = (evt?: MouseEvent<HTMLButtonElement>) => {
    evt?.preventDefault();
    const fileAttachments: Attachment[] = selectedFiles.map((file) => ({
      type: 'File',
      name: file.name
    }));
    const recordingAttachments: Attachment[] = recordings.map((recording) => ({
      type: 'Recording',
      name: recording.name
    }));
    const sketchAttachments: Attachment[] = [];
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

  const onCustomFormSubmit = () => {
    if (customForm && customFormData) {
      createFormInstance({
        formTemplateId: customForm.id,
        title: customForm.title,
        formData: [...customFormData]
      });
    }
  };

  const onSubmit = (submissionType: 'customForm' | 'entry' | null) => {
    switch (submissionType) {
      case 'customForm':
        onCustomFormSubmit();
        break;
      case 'entry':
        onEntrySubmit();
        break;
      default:
        console.error(`Unknown submission type recieved ${submissionType}`);
        break;
    }
  };

  const resetEntry = () =>
    setEntry({
      incidentId,
      sequence: createSequenceNumber(),
      content: {}
    });
  const resetCustomForm = () => setCustomForm(null);
  const resetCustomFormData = () => setCustomFormData([]);

  const handleCancel = () => {
    if (source) {
      let path: string;

      if (source === 'home') path = '/';
      else if (inputType === 'form' && source === 'forms') path = `/forms/${incidentId}`;
      else path = `/logbook/${incidentId}`;
      navigate(path);
    }
  };

  if (!incident) return null;

  return (
    <PageWrapper>
      <EntryInputContainer
        inputType={inputType}
        incident={incident}
        entries={logEntries ?? []}
        entry={entry}
        customForm={customForm}
        customFormData={customFormData}
        setCustomForm={setCustomForm}
        formFields={formFields}
        forms={forms ?? []}
        onFieldChange={onFieldChange}
        onCustomFormDataChange={onCustomFormDataChange}
        resetEntry={resetEntry}
        resetCustomForm={resetCustomForm}
        resetCustomFormData={resetCustomFormData}
        onFilesSelected={onFilesSelected}
        onRemoveSelectedFile={onRemoveSelectedFile}
        onRemoveRecording={onRemoveRecording}
        setSketchLines={setSketchLines}
        onLocationChange={onLocationChange}
        onMainBackClick={handleCancel}
        onSubmit={onSubmit}
        onCancel={handleCancel}
        mentionables={mentionables}
        selectedFiles={selectedFiles}
        recordings={recordings}
        canvasRef={canvasRef}
        sketchLines={sketchLines}
      />
    </PageWrapper>
  );
};
