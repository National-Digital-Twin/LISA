// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { type Incident } from 'common/Incident';
import { type CreateTask } from 'common/Task';
import { type Location as LocationModel } from 'common/Location';
import { type User } from 'common/User';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { type Stage } from 'konva/lib/Stage';
import { useAuth, useIncidents, useToast, useUsers } from '../hooks';
import { useCreateTask } from '../hooks/useTasks';
import PageWrapper from '../components/PageWrapper';
import { PageTitle } from '../components';
import { type SketchLine, type ValidationError } from '../utils/types';
import { Document, Format } from '../utils';
import { createSequenceNumber } from '../utils/Form/sequence';
import {
  TaskMenu,
  TaskNameStep,
  AssigneeStep,
  DescriptionStep,
  LocationStep,
  AttachmentsStep,
  SketchStep
} from '../components/TaskSteps';

type TaskDraftState = {
  task: Omit<CreateTask, 'incidentId'>;
  validationErrors: ValidationError[];
  selectedFiles: File[];
  sketchLines: SketchLine[];
  sketchFile: File | null;
};

export default function CreateTaskPage() {
  const { incidentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: incidents } = useIncidents();
  const { users } = useUsers();
  const createTask = useCreateTask({ author: user.current! });
  const postToast = useToast();

  const incident: Incident | undefined = useMemo(
    () => incidents?.find((i) => i.id === incidentId),
    [incidents, incidentId]
  );

  const [state, setState] = useState<TaskDraftState>({
    task: {
      name: '',
      description: '',
      assignee: { username: '', displayName: '' },
      sequence: createSequenceNumber()
    },
    validationErrors: [],
    selectedFiles: [],
    sketchLines: [],
    sketchFile: null
  });
  
  const sketchCanvasRef = useRef<Stage>(null);

  const validateTask = useCallback((task: Omit<CreateTask, 'incidentId'>): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!task.name?.trim()) errors.push({ fieldId: 'task_name', error: 'Task name is required' });
    if (!task.assignee?.username?.trim())
      errors.push({ fieldId: 'task_assignee', error: 'Please select an assignee' });
    if (!task.description?.trim())
      errors.push({ fieldId: 'task_description', error: 'Add a description' });
    return errors;
  }, []);

  const updateTask = useCallback((updates: Partial<Omit<CreateTask, 'incidentId'>>) => {
    setState(prev => {
      const newTask = { ...prev.task, ...updates };
      return {
        ...prev,
        task: newTask,
        validationErrors: validateTask(newTask)
      };
    });
  }, [validateTask]);

  const updateState = useCallback((updates: Partial<TaskDraftState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    setState(prev => ({ ...prev, validationErrors: validateTask(prev.task) }));
  }, [validateTask]);

  const getError = (fieldId: string) => state.validationErrors.find((e) => e.fieldId === fieldId);

  if (!incident || !incidentId) {
    return (
      <PageWrapper>
        <PageTitle title="Add new task" />
        <div style={{ padding: 16 }}>Loading incident...</div>
      </PageWrapper>
    );
  }

  const assigneeOptions = users
    ?.map(Format.mentionable.user)
    .map(({ id, label }) => ({ value: id, label }));

  const handleNameChange = (name: string) => {
    updateTask({ name });
  };

  const handleAssigneeChange = (assignee: User) => {
    updateTask({ assignee });
  };

  const handleDescriptionChange = (description: string) => {
    updateTask({ description });
  };

  const handleLocationChange = (location: LocationModel | undefined) => {
    updateTask({ location });
  };

  const handleFilesAdd = (files: File[]) => {
    updateState({ selectedFiles: [...state.selectedFiles, ...files] });
  };

  const handleFileRemove = (name: string) => {
    updateState({ selectedFiles: state.selectedFiles.filter(f => f.name !== name) });
  };

  const handleSketchLinesChange = (sketchLines: SketchLine[]) => {
    updateState({ sketchLines });
  };

  const onSubmit = () => {
    const errors = validateTask(state.task);
    if (errors.length > 0) {
      updateState({ validationErrors: errors });
      return;
    }

    const allFiles = state.sketchFile ? [...state.selectedFiles, state.sketchFile] : state.selectedFiles;
    const fileAttachments = state.selectedFiles.map(f => ({ type: 'File' as const, name: f.name }));
    const sketchAttachment = state.sketchFile ? { type: 'Sketch' as const, name: state.sketchFile.name } : null;
    const allAttachments = sketchAttachment ? [...fileAttachments, sketchAttachment] : fileAttachments;

    createTask.mutate(
      {
        task: {
          id: uuidv4(),
          status: 'ToDo',
          incidentId,
          ...state.task,
          attachments: allAttachments.length > 0 ? allAttachments : undefined
        },
        files: allFiles
      },
      {
        onSuccess: () => {
          navigate(`/tasks/${incidentId}`);
        },
        onError: (error) => {
          // eslint-disable-next-line no-console
          console.error('Task creation failed:', error);
          postToast({
            id: uuidv4(),
            content: 'Task creation failed',
            type: 'Error'
          });
        }
      }
    );
  };

  const hash = location.hash ?? '';
  
  const goMain = () => {
    if (hash === '#sketch' && state.sketchLines.length > 0 && sketchCanvasRef.current) {
      const dataURL = sketchCanvasRef.current.toDataURL();
      if (dataURL) {
        const file = Document.dataURLtoFile(dataURL, `Sketch ${Format.timestamp()}.png`);
        updateState({ sketchFile: file });
      }
    }
    navigate(location.pathname, { replace: true });
  };
  
  const navigateTo = (step: string) => navigate(`#${step}`, { replace: true });

  const handleBackClick = () => {
    if (hash) {
      navigate(location.pathname, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const stepComponents = {
    '#name': (
      <TaskNameStep
        value={state.task.name}
        error={getError('task_name')}
        onChange={handleNameChange}
        onBack={goMain}
      />
    ),
    '#assignee': (
      <AssigneeStep
        assignee={state.task.assignee}
        options={assigneeOptions ?? []}
        error={getError('task_assignee')}
        onChange={handleAssigneeChange}
        onBack={goMain}
      />
    ),
    '#description': (
      <DescriptionStep
        value={state.task.description}
        error={getError('task_description')}
        onChange={handleDescriptionChange}
        onBack={goMain}
      />
    ),
    '#location': (
      <LocationStep
        location={state.task.location}
        onChange={handleLocationChange}
        onBack={goMain}
      />
    ),
    '#attachments': (
      <AttachmentsStep
        selectedFiles={state.selectedFiles}
        onFilesSelected={handleFilesAdd}
        removeSelectedFile={handleFileRemove}
        onBack={goMain}
      />
    ),
    '#sketch': (
      <SketchStep
        canvasRef={sketchCanvasRef}
        lines={state.sketchLines}
        onChangeLines={handleSketchLinesChange}
        onBack={goMain}
      />
    )
  };

  if (stepComponents[hash as keyof typeof stepComponents]) {
    return stepComponents[hash as keyof typeof stepComponents];
  }

  return (
    <PageWrapper>
      <PageTitle
        title="Add new task"
        titleStart={
          <IconButton aria-label="Back" onClick={handleBackClick}>
            <ArrowBackIcon />
          </IconButton>
        }
      />
      <TaskMenu
        validationErrors={state.validationErrors}
        onNavigateToStep={navigateTo}
        onCancel={handleCancel}
        onSubmit={onSubmit}
        isSubmitting={createTask.isPending}
      />
    </PageWrapper>
  );
}
