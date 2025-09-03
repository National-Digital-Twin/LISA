import { useCallback, useMemo, useRef, useState } from 'react';
import { Stage } from 'konva/lib/Stage';
import { v4 as uuidV4 } from 'uuid';
import { Box, FormControl, MenuItem, TextField } from '@mui/material';
import { type CreateTask } from 'common/Task';
import { type User } from 'common/User';
import { type Location as TypeOfLocation } from 'common/Location';
import { type Mentionable } from 'common/Mentionable';

import { SketchLine, ValidationError } from '../../utils/types';
import { EntityInputContainer, EntityInputContainerData } from '../AddEntity/EntityInputContainer';
import { EntityOptionsContainer } from '../AddEntity/EntityOptionsContainer';
import { EntityOptionData } from '../AddEntity/EntityOptions';
import { Document, Format } from '../../utils';
import { createSequenceNumber } from '../../utils/Form/sequence';
import Location from '../AddEntry/Location';
import Files from '../AddEntry/Files';
import Sketch from '../AddEntry/Sketch';
import { Attachment } from 'common/Attachment';
import EntryContent from '../lexical/EntryContent';

type Props = {
  users: User[];
  incidentId: string;
  mentionables: Array<Mentionable>;
  onSubmit: (task: CreateTask & Required<Pick<CreateTask, 'id' | 'status'>>, files: File[]) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

type FieldType = 'name' | 'assignee' | 'content' | 'location' | 'attachments' | 'sketch' ;

const fieldConfigs = {
  name: { heading: 'Task name', required: true, supportedOffline: true },
  assignee: { heading: 'Assign to', required: true, supportedOffline: true },
  content: { heading: 'Add task description', required: true, supportedOffline: true },
  location: { heading: 'Add location(s)', required: false, supportedOffline: false },
  attachments: { heading: 'Add attachments', required: false, supportedOffline: true },
  sketch: { heading: 'Add sketch', required: false, supportedOffline: true }
};

export const TaskInputContainer = ({
  users,
  incidentId,
  mentionables,
  onSubmit,
  onCancel,
  isSubmitting = false
}: Readonly<Props>) => {
  const [level, setLevel] = useState<number>(0);
  const [activeField, setActiveField] = useState<FieldType | null>(null);

  const [task, setTask] = useState<Partial<Omit<CreateTask, 'incidentId'>>>({
    sequence: createSequenceNumber()
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sketchLines, setSketchLines] = useState<SketchLine[]>([]);
  const [sketchFile, setSketchFile] = useState<File | null>(null);
  const canvasRef = useRef<Stage>(null);

  const validateTask = useCallback(
    (task: Partial<Omit<CreateTask, 'incidentId'>>): ValidationError[] => {
      const errors: ValidationError[] = [];
      if (!task.name?.trim()) {
        errors.push({ fieldId: 'task_name', error: 'Task name is required' });
      }
      if (!task.assignee?.username?.trim()) {
        errors.push({ fieldId: 'task_assignee', error: 'Please select an assignee' });
      }
      if (!task.description?.trim()) {
        errors.push({ fieldId: 'task_description', error: 'Add a description' });
      }
      return errors;
    },
    []
  );

  const errors = useMemo(() => validateTask(task), [task, validateTask]);

  const setLevelAndClearState = (level: number) => {
    // When leaving sketch screen, capture the canvas if there are sketch lines
    if (activeField === 'sketch' && level === 0 && sketchLines.length > 0 && canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL();
      if (dataURL) {
        const file = Document.dataURLtoFile(dataURL, `Sketch ${Format.timestamp()}.png`);
        setSketchFile(file);
      }
    }

    setLevel(level);
    setActiveField(null);
  };

  const getFieldError = (fieldId: string) => errors.find((e) => e.fieldId === fieldId);

  const activateField = (field: FieldType) => {
    setActiveField(field);
    setLevel(1);
  };

  const onTaskChange = (updates: Partial<Omit<CreateTask, 'incidentId'>>) => {
    setTask((prev) => ({ ...prev, ...updates }));
  };

  const isFileAlreadySelected = (file: File, existingFiles: File[]) => {
    return existingFiles.some((existing) => existing.name === file.name);
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => {
      const newFiles = files.filter((file) => !isFileAlreadySelected(file, prev));
      return [...prev, ...newFiles];
    });
  };

  const handleFileRemove = (name: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const assigneeOptions = useMemo(() => {
    return users
      ?.filter((user) => user.displayName)
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .map((user) => ({ value: user.username, label: user.displayName }));
  }, [users]);

  const handleSubmit = () => {
    const validationErrors = validateTask(task);
    if (validationErrors.length > 0) {
      return;
    }

    const files: File[] = [...selectedFiles];
    const attachments: Attachment[] = selectedFiles.map((f) => ({
      type: 'File' as const,
      name: f.name
    }));

    if (sketchFile) {
      files.push(sketchFile);
      attachments.push({ type: 'Sketch' as const, name: sketchFile.name });
    }

    const completeTask: CreateTask & Required<Pick<CreateTask, 'id' | 'status'>> = {
      id: uuidV4(),
      status: 'ToDo',
      incidentId,
      ...(task as Omit<CreateTask, 'incidentId'>),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    onSubmit(completeTask, files);
  };

  const getFieldValue = (field: FieldType) => {
    switch (field) {
      case 'name':
        return task.name;
      case 'assignee':
        return task.assignee?.displayName;
      case 'content':
        return task.content?.text || task.description || undefined;
      case 'location':
        return task.location ? 'View location' : undefined;
      case 'attachments':
        return selectedFiles.length > 0 ? `${selectedFiles.length} files` : undefined;
      case 'sketch':
        return sketchFile ? 'View sketch' : undefined;
    }
  };

  const entityOptionData: EntityOptionData[] = (Object.keys(fieldConfigs) as FieldType[]).map(
    (field) => ({
      id: field,
      onClick: () => activateField(field),
      value: getFieldValue(field),
      required: fieldConfigs[field].required,
      supportedOffline: fieldConfigs[field].supportedOffline
    })
  );

  const changeEvent = (_id: string, json: string, text: string) =>
    onTaskChange({ content: { text, json } });

  const renderFieldInput = () => {
    if (!activeField) return null;

    switch (activeField) {
      case 'name':
        return (
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <TextField
              hiddenLabel
              variant="filled"
              placeholder="Task name"
              value={task.name || ''}
              onChange={(event) => onTaskChange({ name: event.target.value })}
              error={!!getFieldError('task_name')}
              helperText={getFieldError('task_name')?.error}
            />
          </FormControl>
        );

      case 'assignee':
        return (
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <TextField
              select
              value={task.assignee?.username || ''}
              variant="filled"
              label={task.assignee?.username ? '' : 'Select assignee'}
              onChange={(event) => {
                const selectedUser = users?.find((u) => u.username === event.target.value);
                if (selectedUser) {
                  onTaskChange({ assignee: selectedUser });
                }
              }}
              slotProps={{ inputLabel: { shrink: false } }}
              error={!!getFieldError('task_assignee')}
              helperText={getFieldError('task_assignee')?.error}
            >
              {assigneeOptions?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        );

      case 'content':
        return (
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <EntryContent
              id="content"
              json={task.content?.json || undefined}
              editable
              mentionables={mentionables}
              recordingActive={false}
              onChange={changeEvent}
              onRecording={() => null}
              error={!!getFieldError('task_description')}
              placeholder={'Type @ to tag a person, log, task or file'}
            />
          </FormControl>
        );

      case 'location':
        return (
          <Location.Content
            location={task.location}
            validationErrors={errors}
            onLocationChange={(location) => onTaskChange({ location: location as TypeOfLocation })}
          />
        );

      case 'attachments':
        return (
          <Files.Content
            active={true}
            selectedFiles={selectedFiles}
            recordings={[]}
            onFilesSelected={handleFilesSelected}
            removeSelectedFile={handleFileRemove}
            removeRecording={() => {}}
          />
        );

      case 'sketch':
        return (
          <Sketch.Content
            active={true}
            canvasRef={canvasRef}
            lines={sketchLines}
            onChangeLines={setSketchLines}
          />
        );

      default:
        return null;
    }
  };

  const inputContainerData: EntityInputContainerData[] = [
    {
      heading: 'Add new task',
      inputControls: (
        <EntityOptionsContainer entityType="tasks" data={entityOptionData} errors={errors} />
      ),
      showButtons: true
    },
    {
      heading: activeField ? fieldConfigs[activeField].heading : '',
      inputControls: <Box flexGrow={1}>{renderFieldInput()}</Box>
    }
  ];

  return (
    <EntityInputContainer
      data={inputContainerData}
      onMainBackClick={onCancel}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      level={level}
      setLevel={setLevelAndClearState}
      disableSubmit={errors.length > 0 || isSubmitting}
    />
  );
};
