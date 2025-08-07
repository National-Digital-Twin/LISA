// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, Typography } from '@mui/material';
import { type Task, type TaskStatus } from 'common/Task';
import { type User } from 'common/User';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FormField, PageTitle } from '../components';
import { FormFooter } from '../components/Form';
import PageWrapper from '../components/PageWrapper';
import Status from '../components/Status';
import { useAuth, useIncidents, useLogEntries, useUsers } from '../hooks';
import { useResponsive } from '../hooks/useResponsiveHook';
import { useUpdateTaskAssignee, useUpdateTaskStatus } from '../hooks/useTasks';
import { Format } from '../utils';
import { FieldValueType, ValidationError } from '../utils/types';

const Tasks = () => {
  const { incidentId } = useParams();
  const query = useIncidents();
  const { users } = useUsers();
  const { logEntries } = useLogEntries(incidentId);
  const { user } = useAuth();
  const { isBelowMd } = useResponsive();
  const updateTaskStatus = useUpdateTaskStatus(incidentId);
  const updateTaskAssignee = useUpdateTaskAssignee(incidentId);
  const location = useLocation();

  const defaultUpdateTask = {
    id: undefined,
    loading: false,
    status: { edit: false, value: undefined, error: undefined },
    assignee: { edit: false, value: undefined, error: undefined }
  };

  const [updateTask, setUpdateTask] = useState<{
    id: string | undefined;
    loading: boolean;
    status: { edit: boolean; value: TaskStatus | undefined; error: ValidationError | undefined };
    assignee: { edit: boolean; value: User | undefined; error: ValidationError | undefined };
  }>(defaultUpdateTask);
  const [displayErrors, setDisplayErrors] = useState(false);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHighlightedTaskId(elementId);

        setTimeout(() => {
          setHighlightedTaskId(null);
        }, 2000);
      }
    }
  }, [location]);

  const taskEntries = logEntries?.filter((entry) => entry.task);
  const hasTasks = Array.isArray(taskEntries) && taskEntries.length > 0;
  const incident = query?.data?.find((inc) => inc.id === incidentId);
  const resetUpdateTask = () => setUpdateTask(defaultUpdateTask);
  const assignees = users?.map(Format.mentionable.user).map(({ id, label }) => ({
    value: id,
    label
  }));

  if (!incident) return null;

  const canUpdateTask = (task: Task) => {
    const currentUsername = user.current?.username;
    const taskAssigneeUsername = task.assignee?.username;
    return currentUsername === taskAssigneeUsername;
  };

  const handleOnClickStatus = (task: Task) => {
    if (task.id === updateTask.id) return setUpdateTask(defaultUpdateTask);
    return setUpdateTask({
      ...updateTask,
      id: task.id,
      status: {
        ...updateTask.status,
        edit: true,
        value: task.status,
        error: { fieldId: 'name', error: 'Please select a new status.' }
      }
    });
  };

  const handleOnClickAssignee = (task: Task) => {
    if (task.id === updateTask.id) return setUpdateTask(defaultUpdateTask);
    return setUpdateTask({
      ...updateTask,
      id: task.id,
      assignee: {
        ...updateTask.assignee,
        edit: true,
        error: { fieldId: 'assignee', error: 'Please select a new user.' }
      }
    });
  };

  const handleUpdateStatus = (task: Task, value: FieldValueType) => {
    if (value) {
      let isValidNextStep = false;
      if (task.status === 'ToDo') {
        isValidNextStep = value === 'InProgress' || value === 'Done';
      } else if (task.status === 'InProgress') {
        isValidNextStep = value === 'Done';
      }

      let error: ValidationError | undefined;
      if (task.status === value) {
        error = { fieldId: 'name', error: 'Please select a new status' };
      } else if (!isValidNextStep) {
        error = { fieldId: 'name', error: 'Cannot move backwards in status progression' };
      }

      setUpdateTask({
        ...updateTask,
        status: { ...updateTask.status, value: value as TaskStatus, error }
      });
    }
  };

  const handleUpdateAssignee = (task: Task, value: FieldValueType) => {
    const findAssignee = assignees?.find((user) => user.value === value);
    if (findAssignee) {
      const error =
        findAssignee.value === task.assignee?.username.replace(/\s+/g, '.').toLowerCase()
          ? { fieldId: 'assignee', error: 'Please select a new user' }
          : undefined;
      setUpdateTask({
        ...updateTask,
        assignee: {
          ...updateTask.assignee,
          value: { username: findAssignee.value, displayName: findAssignee.label, email: '', groups: [] },
          error
        }
      });
    }
  };

  const handleOnCancel = () => {
    setUpdateTask(defaultUpdateTask);
  };

  const handleOnSubmit = (task: Task) => {
    if (updateTask.status.edit && updateTask.status.value) {
      updateTaskStatus.mutate(
        { task: { ...task, status: updateTask.status.value } },
        { onSettled: resetUpdateTask }
      );
    }
    if (updateTask.assignee.edit && updateTask.assignee.value) {
      updateTaskAssignee.mutate(
        { task: { ...task, assignee: updateTask.assignee.value } },
        { onSettled: resetUpdateTask }
      );
    }
  };

  return (
    <PageWrapper>
      <PageTitle
        title={Format.incident.type(incident.type)}
        subtitle={incident.name}
        stage={incident.stage}
      />
      <Box display="flex" flexDirection="column" gap={2}>
        {hasTasks ? (
          taskEntries.map((entry) => {
            const { task } = entry;

            if (!task) {
              return (
                <Box key={entry.id}>
                  <Typography variant="h5" component="h2" color="error">
                    Error: Unable to display task information.
                  </Typography>
                </Box>
              );
            }

            const formatDefaultAssignee =
              task.assignee?.username.replace(/\s+/g, '.').toLowerCase() ?? '';
            const isTaskUpdating = updateTask.id === task.id;
            const isStatusUpdating = isTaskUpdating && updateTask.status.edit;
            const isAssigneeUpdating = isTaskUpdating && updateTask.assignee.edit;
            const canUpdate = canUpdateTask(task);

            const validationErrors = () => {
              if (isStatusUpdating) {
                return updateTask.status.error ? [updateTask.status.error] : [];
              }
              if (isAssigneeUpdating) {
                return updateTask.assignee.error ? [updateTask.assignee.error] : [];
              }
              return [];
            };

            const statusValue = () => task.status ?? 'ToDo';

            return (
              <Box
                key={entry.id}
                id={entry.id}
                display="flex"
                flexDirection="column"
                bgcolor="background.default"
                padding={2}
                gap={2}
                sx={{
                  border: highlightedTaskId === entry.id ? '2px solid' : '1px solid',
                  borderColor: highlightedTaskId === entry.id ? 'accent.main' : 'border.main',
                  borderRadius: 1
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  bgcolor="background.default"
                  padding={2}
                  gap={2}
                >
                  <Box display="flex" flexDirection={isBelowMd ? 'column' : 'row-reverse'} gap={2}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent={isBelowMd ? 'flex-start' : 'flex-end'}
                      gap={2}
                      flexGrow={0.5}
                    >
                      <Button
                        type="button"
                        size="small"
                        variant="contained"
                        onClick={() => handleOnClickStatus(task)}
                        disabled={isAssigneeUpdating || !canUpdate || task.status === 'Done'}
                        fullWidth={isBelowMd}
                        sx={{ maxHeight: 40 }}
                      >
                        Change Status
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        variant="contained"
                        onClick={() => handleOnClickAssignee(task)}
                        fullWidth={isBelowMd}
                        disabled={isStatusUpdating || !canUpdate || task.status === 'Done'}
                        sx={{ maxHeight: 40 }}
                      >
                        Change Assignee
                      </Button>
                    </Box>

                    <Box
                      display="flex"
                      flexDirection={isBelowMd ? 'column' : 'row'}
                      justifyContent="space-between"
                      gap={2}
                      flexGrow={1}
                      alignItems="flex-start"
                    >
                      <Box display="flex" flexDirection="column" gap={2} flex={1}>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body1" fontWeight="bold">
                            Current Status
                          </Typography>
                          <Status width="fit-content" status={statusValue()} />
                        </Box>
                        {isStatusUpdating && (
                          <Box component="ul" width="100%">
                            <FormField
                              component="li"
                              field={{
                                id: 'name',
                                type: 'Select',
                                label: 'New Status',
                                value: updateTask.status.value ?? task.status,
                                options: [
                                  { value: 'ToDo', label: 'To Do' },
                                  { value: 'InProgress', label: 'In Progress' },
                                  { value: 'Done', label: 'Done' }
                                ]
                              }}
                              error={
                                displayErrors
                                  ? (updateTask.status.error as ValidationError)
                                  : undefined
                              }
                              onChange={(_, value) => handleUpdateStatus(task, value)}
                            />
                          </Box>
                        )}

                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body1" fontWeight="bold">
                            Task description
                          </Typography>
                          <Typography variant="body1">{task.description}</Typography>
                        </Box>

                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body1" fontWeight="bold">
                            Assigned by
                          </Typography>
                          <Typography variant="body1">{Format.user(entry.author)}</Typography>
                        </Box>
                      </Box>

                      <Box display="flex" flexDirection="column" gap={2} flex={1}>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body1" fontWeight="bold">
                            Assigned to
                          </Typography>
                          <Typography>{Format.user(task.assignee)}</Typography>
                          {isAssigneeUpdating && (
                            <Box component="ul" width="100%">
                              <FormField
                                component="li"
                                field={{
                                  id: 'assignee',
                                  type: 'Select',
                                  label: 'Assign to',
                                  value: formatDefaultAssignee,
                                  options: assignees ?? []
                                }}
                                error={
                                  displayErrors
                                    ? (updateTask.assignee.error as ValidationError)
                                    : undefined
                                }
                                onChange={(_, value) => handleUpdateAssignee(task, value)}
                              />
                            </Box>
                          )}
                        </Box>

                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body1" fontWeight="bold">
                            Date and time recorded
                          </Typography>
                          <Typography variant="body1">
                            {Format.dateAndTimeMobile(entry.dateTime)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    component={Link}
                    color="primary"
                    sx={{ textDecoration: 'underline !important' }}
                    to={`/logbook/${incidentId}#${entry.id}`}
                  >
                    View log entry
                  </Typography>
                  <Box />
                  {(isStatusUpdating || isAssigneeUpdating) && (
                    <FormFooter
                      validationErrors={validationErrors()}
                      onShowValidationErrors={() => setDisplayErrors(!displayErrors)}
                      onCancel={handleOnCancel}
                      onSubmit={() => handleOnSubmit(task)}
                      loading={updateTask.loading}
                    />
                  )}
                </Box>
              </Box>
            );
          })
        ) : (
          <>
            <h3>There are currently no tasks.</h3>
            <hr />
          </>
        )}
      </Box>
    </PageWrapper>
  );
};

export default Tasks;
