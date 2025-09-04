// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Stage } from 'konva/lib/Stage';
import { type LogEntry } from 'common/LogEntry';
import { Attachment } from 'common/Attachment';
import { Mentionable } from 'common/Mentionable';
import { type Location } from 'common/Location';
import { useCreateLogEntry, useIncidents, useLogEntries, useUsers } from '../hooks';
import { createSequenceNumber } from '../utils/Form/sequence';
import PageWrapper from '../components/PageWrapper';
import { FormsInputContainer } from '../components/Form/FormsInputContainer';
import { FieldValueType, SketchLine } from '../utils/types';
import { Document, Format, Form as FormUtils } from '../utils';
import { OnCreateEntry } from '../utils/handlers';
import { getSortedEntriesWithDisplaySequence } from '../utils/sortEntries';
import { useAttachments } from '../hooks/useAttachments';
import { useIsOnline } from '../hooks/useIsOnline';
import { Field } from 'common/Field';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { LogEntryType } from 'common/LogEntryType';
import { useFormTemplates } from '../hooks/Forms/useFormTemplates';
import { Form, FormDataProperty } from '../components/CustomForms/FormTemplates/types';
import { useCreateFormInstance } from '../hooks/Forms/useFormInstances';

export const CreateEntryForm = () => {
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

  const [entry, setEntry] = useState<Partial<LogEntry>>({
    incidentId,
    sequence: createSequenceNumber(),
    content: {}
  });

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
    () => [
      ...(getSortedEntriesWithDisplaySequence(false, logEntries ?? [])?.map((e) =>
        Format.mentionable.entry(e)
      ) ?? []),
      ...(users
        ?.filter((user) => user.displayName)
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
        .map(Format.mentionable.user) ?? []),
      ...selectedFiles.map((file) =>
        Format.mentionable.attachment({ name: file.name, type: 'File' })
      ),
      ...recordings.map((file) => Format.mentionable.attachment({ name: file.name, type: 'File' })),
      ...otherAttachments
    ],
    [logEntries, users, selectedFiles, recordings, otherAttachments]
  );

  useEffect(() => {
    if (!isOnline) {
      setEntry((prev) => ({ ...prev, location: undefined }));
    }
  }, [isOnline, setEntry]);

  useEffect(() => {
    if (entry.type) {
      setFormFields(LogEntryTypes[entry.type as LogEntryType].fields(entry));
    }
  }, [setFormFields, entry]);

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

  const handleCancel = () => navigate(source && source === 'home' ? '/' : `/logbook/${incidentId}`);

  if (!incident) return null;

  return (
    <PageWrapper>
      <FormsInputContainer
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
