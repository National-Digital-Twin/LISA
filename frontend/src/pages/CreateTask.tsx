// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type Incident } from 'common/Incident';
import { type CreateTask } from 'common/Task';
import { type LogEntry } from 'common/LogEntry';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth, useIncidents, useToast, useUsers } from '../hooks';
import { useCreateTask } from '../hooks/useTasks';
import PageWrapper from '../components/PageWrapper';
import { TaskInputContainer } from '../components/Task/TaskInputContainer';
import { getSortedEntriesWithDisplaySequence } from '../utils/sortEntries';
import { Format } from '../utils';
import { type Mentionable } from 'common/Mentionable';

export default function CreateTaskPage() {
  const { incidentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: incidents } = useIncidents();
  const { users } = useUsers();
  const createTask = useCreateTask({ author: user.current!, incidentId });
  const postToast = useToast();

  const incident: Incident | undefined = useMemo(
    () => incidents?.find((i) => i.id === incidentId),
    [incidents, incidentId]
  );

  const handleSubmit = (
    task: CreateTask & Required<Pick<CreateTask, 'id' | 'status'>>,
    files: File[]
  ) => {
    createTask.mutate(
      { task, files },
      {
        onSuccess: (data) => {
          navigate(`/tasks/${data.id}`);
        },
        onError: (error) => {
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

  if (!incident || !incidentId) {
    return (
      <PageWrapper>
        <div style={{ padding: 16 }}>Loading incident...</div>
      </PageWrapper>
    );
  }

  const otherAttachments: Array<Mentionable> = [];
  const selectedFiles :Array<File> = [];
  const logEntries:Array<LogEntry> = [];
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
      ...otherAttachments
    ],
    [logEntries, users, selectedFiles, otherAttachments]
  );

  return (
    <PageWrapper>
      <TaskInputContainer
        users={users || []}
        incidentId={incidentId}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        mentionables={mentionables}
        isSubmitting={createTask.isPending}
      />
    </PageWrapper>
  );
}
