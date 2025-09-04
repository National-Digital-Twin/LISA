import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { Stage } from 'konva/lib/Stage';
import { LogEntry } from 'common/LogEntry';
import { Mentionable } from 'common/Mentionable';
import { Attachment } from 'common/Attachment';
import { Location } from 'common/Location';
import { useCreateLogEntry, useIncidents, useLogEntries, useUsers } from '../hooks';
import { useAttachments } from '../hooks/useAttachments';
import { useIsOnline } from '../hooks/useIsOnline';
import { createSequenceNumber } from '../utils/Form/sequence';
import { FieldValueType, SketchLine } from '../utils/types';
import { Document, Form as FormUtils, Format } from '../utils';
import { getSortedEntriesWithDisplaySequence } from '../utils/sortEntries';
import { OnCreateEntry } from '../utils/handlers';
import PageWrapper from '../components/PageWrapper';
import { UpdateInputContainer } from '../components/AddEntry/Update/UpdateInputContainer';

export const CreateEntryUpdate = () => {
  const { incidentId } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source');
  const navigate = useNavigate();
  const incidents = useIncidents();
  const incident = incidents?.data?.find((inc) => inc.id === incidentId);
  const { logEntries } = useLogEntries(incidentId);
  const { attachments: incidentAttachments } = useAttachments(incident?.id);
  const { users } = useUsers();
  const { createLogEntry } = useCreateLogEntry(incidentId, () =>
    navigate(`/logbook/${incidentId}`)
  );
  const isOnline = useIsOnline();

  const [entry, setEntry] = useState<Partial<LogEntry>>({
    type: 'Update',
    incidentId,
    sequence: createSequenceNumber(),
    content: {}
  });

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

  const onFieldChange = (id: string, value: FieldValueType) => {
    setEntry((prev) => FormUtils.updateLogEntry(prev, id, value, false));
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

  const onUpdateSubmit = (evt?: MouseEvent<HTMLButtonElement>) => {
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

  const handleCancel = () => navigate(source && source === 'home' ? '/' : `/logbook/${incidentId}`);

  if (!incident) return null;

  return (
    <PageWrapper>
      <UpdateInputContainer
        incident={incident}
        entry={entry}
        onFieldChange={onFieldChange}
        onFilesSelected={onFilesSelected}
        onRemoveSelectedFile={onRemoveSelectedFile}
        onRemoveRecording={onRemoveRecording}
        setSketchLines={setSketchLines}
        onMainBackClick={handleCancel}
        onLocationChange={onLocationChange}
        onSubmit={onUpdateSubmit}
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
