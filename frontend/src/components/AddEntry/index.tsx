// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { type Stage } from 'konva/lib/Stage';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

// Local imports
import { type Incident } from 'common/Incident';
import { type Location as LocationType } from 'common/Location';
import { type LogEntry } from 'common/LogEntry';
import { type LogEntryAttachment } from 'common/LogEntryAttachment';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';
import { type Mentionable } from 'common/Mentionable';
import { useUsers } from '../../hooks';
import { Document, Form as FormUtils, Format, Validate } from '../../utils';
import { MODAL_KEY } from '../../utils/constants';
import { type FieldValueType, type SketchLine, type ValidationError } from '../../utils/types';
import { FormFooter } from '../Form';
import Modal from '../Modal';
import { TABS } from './constants';
import Files from './Files';
import Form from './Form';
import { Header, TabPanel } from './Header';
import Location from './Location';
import Sketch from './Sketch';

// Handlers
import { type OnCreateEntry } from '../../utils/handlers';
import { useAttachments } from '../../hooks/useAttachments';
import { getSortedEntriesWithDisplaySequence } from '../../utils/sortEntries';
import Task from './Task';
import { createSequenceNumber } from '../../utils/Form/sequence';

type AddEntryProps = {
  incident?: Incident;
  entries: Array<LogEntry>;
  onCreateEntry: OnCreateEntry;
  onCancel: () => void;
  loading?: boolean;
};

const AddEntry = ({
  incident = undefined,
  entries,
  onCreateEntry,
  onCancel,
  loading = false
}: AddEntryProps) => {
  const locationMeta = useLocation();
  const hash = locationMeta.hash.length > 0 ? locationMeta.hash : TABS.FORM;
  const { users } = useUsers();
  const [entry, setEntry] = useState<Partial<LogEntry>>({
    incidentId: incident?.id,
    sequence: createSequenceNumber(new Date()),
    type: 'General',
    content: {}
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [startAt] = useState<string>(new Date().toISOString());
  const [sketchLines, setSketchLines] = useState<SketchLine[]>([]);
  const sketchCanvasRef = useRef<Stage>(null);
  const [modal] = useState<boolean>(sessionStorage.getItem(MODAL_KEY) === 'yes');
  const { attachments: incidentAttachments } = useAttachments(incident?.id);

  useEffect(() => {
    setValidationErrors(Validate.entry(entry, [...selectedFiles, ...recordings]));
  }, [entry, selectedFiles, recordings]);

  const otherAttachments: Array<Mentionable> = useMemo(() => {
    if (!incidentAttachments) {
      return [];
    }
    return incidentAttachments.map(Format.mentionable.attachment);
  }, [incidentAttachments]);

  const mentionables: Array<Mentionable> = useMemo(
    () => [
      ...(getSortedEntriesWithDisplaySequence(false, entries)?.map((e) =>
        Format.mentionable.entry(e)
      ) ?? []),
      ...(users?.map(Format.mentionable.user) ?? []),
      ...selectedFiles.map((file) =>
        Format.mentionable.attachment({ name: file.name, type: 'File' })
      ),
      ...recordings.map((file) => Format.mentionable.attachment({ name: file.name, type: 'File' })),
      ...otherAttachments
    ],
    [entries, users, selectedFiles, recordings, otherAttachments]
  );

  if (!incident) {
    return null;
  }

  const onAddRecording = (recording: File) => {
    setRecordings((prev) => [...prev, recording]);
  };

  const onLogEntry = (evt?: MouseEvent<HTMLButtonElement>) => {
    evt?.preventDefault();
    const dateTime = entry.dateTime ?? startAt;
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
      const dataURL = sketchCanvasRef.current?.toDataURL();
      if (dataURL) {
        const file = Document.dataURLtoFile(dataURL, `Sketch ${Format.timestamp()}.png`);
        sketchAttachments.push({ type: 'Sketch', name: file.name });
        sketches.push(file);
      }
    }
    const attachments = [...fileAttachments, ...recordingAttachments, ...sketchAttachments];
    entry.attachments = attachments.length > 0 ? attachments : undefined;

    let mutatedEntry = entry;
    if (entry.task?.include === 'Yes') {
      mutatedEntry = { ...entry, task: { ...entry.task, status: 'Open' } };
    }

    onCreateEntry({ ...mutatedEntry, dateTime } as LogEntry, [
      ...selectedFiles,
      ...recordings,
      ...sketches
    ]);
  };

  const onFieldChange = (id: string, value: FieldValueType, nested = false) => {
    setEntry((prev) => {
      let updated = FormUtils.updateLogEntry(prev, id, value, nested);
      if (nested) {
        const changedField = updated.fields?.find((f) => f.id === id);
        if (changedField?.type === 'SelectLogEntry') {
          // We need to populate this log entry from the one that's been selected.
          const selection = entries?.find((e) => e.id === changedField.value);
          if (selection) {
            updated = FormUtils.copyIntoLogEntry(updated, selection);
          }
        }
      }
      return updated;
    });
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

  const onLocationChange = (location: Partial<LocationType>) => {
    setEntry((prev) => ({ ...prev, location }) as LogEntry);
  };

  const onTaskChange = (id: string, value: FieldValueType) => {
    setEntry((prev) => ({ ...prev, task: { ...prev.task, [id]: value } }));
  };

  return (
    <Modal modal={modal} onClose={onCancel}>
      <Box display="flex" flexDirection="column" displayPrint="none">
        <Header
          fileCount={selectedFiles.length + recordings.length}
          validationErrors={validationErrors}
          showValidationErrors={showValidationErrors}
        />
        <Box padding={2} component="form" bgcolor="background.default" id="rollup-log-book-entry">
          <TabPanel value={TABS.FORM} hash={hash}>
            <Form.Content
              active={!hash || hash.includes(TABS.FORM)}
              entry={entry}
              entries={entries}
              incident={incident}
              mentionables={mentionables}
              validationErrors={validationErrors}
              onFieldChange={onFieldChange}
              onAddRecording={onAddRecording}
              showValidationErrors={showValidationErrors}
            />
          </TabPanel>
          <TabPanel value={TABS.LOCATION} hash={hash}>
            <Location.Content
              active={hash?.includes(TABS.LOCATION)}
              required={entry.type && LogEntryTypes[entry.type].requireLocation}
              location={entry.location}
              validationErrors={validationErrors}
              onLocationChange={onLocationChange}
              showValidationErrors={showValidationErrors}
            />
          </TabPanel>
          <TabPanel value={TABS.FILES} hash={hash}>
            <Files.Content
              active={hash?.includes(TABS.FILES)}
              selectedFiles={selectedFiles}
              recordings={recordings}
              onFilesSelected={onFilesSelect}
              removeSelectedFile={removeSelectedFile}
              removeRecording={removeRecording}
            />
          </TabPanel>
          <TabPanel value={TABS.SKETCH} hash={hash}>
            <Sketch.Content
              active={hash?.includes(TABS.SKETCH)}
              canvasRef={sketchCanvasRef}
              lines={sketchLines}
              onChangeLines={setSketchLines}
            />
          </TabPanel>
          <TabPanel value={TABS.TASK} hash={hash}>
            <Task.Content
              task={entry.task}
              entries={entries}
              onFieldChange={onTaskChange}
              users={users}
              validationErrors={validationErrors}
              showValidationErrors={showValidationErrors}
            />
          </TabPanel>

          <Box mt={2}>
            <FormFooter
              validationErrors={validationErrors}
              onCancel={onCancel}
              onSubmit={onLogEntry}
              onShowValidationErrors={setShowValidationErrors}
              loading={loading}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEntry;
