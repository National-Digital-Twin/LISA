// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { Task, TaskStatus } from 'common/Task';
import { User } from 'common/User';
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import { useAuth, useUsers, useTasksUpdates } from '../hooks';
import { useTasks, useUpdateTaskStatus, useUpdateTaskAssignee  } from '../hooks/useTasks';
import { useIsOnline } from '../hooks/useIsOnline';
import { GridListItem } from '../components/GridListItem';
import AssigneeSelector from '../components/InlineSelectors/AssigneeSelector';
import TaskStatusSelector from '../components/InlineSelectors/TaskStatusSelector';
import { toStatusHumanReadable } from '../components/Tasks/utils/statusLabelMapper';
import { Format } from '../utils';
import { logInfo } from '../utils/logger';
import StatusMini from '../components/Tasks/StatusMini';
import { LocationValue } from '../utils/Format/entry/fields/LocationValue';
import AttachmentLink from '../components/AttachmentLink';

const TaskFallback = ({ header, message }: Readonly<{ header: React.ReactNode, message: string }>) => {
  return (
    <>
      {header}
      <PageWrapper>
        <Box sx={{ padding: 3 }}>
          <Typography variant="body1">{message}</Typography>
        </Box>
      </PageWrapper>
    </>
  );
};

interface TaskContentProps {
  header: React.ReactNode;
  task: Task;
  users: User[];
}

const TaskContent = ({ header, task, users }: Readonly<TaskContentProps>) => {
  const { mutate: updateStatus } = useUpdateTaskStatus(task.incidentId);
  const { mutate: updateAssignee } = useUpdateTaskAssignee(task.incidentId);
  const { user } = useAuth();

  const onChangeAssignee = (newAssignee: User) => {
    updateAssignee(
      { task: { ...task, assignee: newAssignee } },
      {
        onError: (e) => logInfo(`failed to update assignee: ${e.message}`),
        onSuccess: () => logInfo(`assignee changed to ${newAssignee.displayName}`)
      }
    );
  };

  const onChangeStatus = (newStatus: TaskStatus) => {
    updateStatus(
      { task: { ...task, status: newStatus } },
      {
        onError: (e) => logInfo(`failed to update status: ${e.message}`),
        onSuccess: () => logInfo(`status changed to ${newStatus}`)
      }
    );
  };

  let content: ReactNode = null;

  if (task.content?.json) {
    content = Format.lexical.html(task.content.json);
  }
  if (!content && task.content?.text) {
    content = task.content.text;
  }

  const contentEl: React.ReactElement | undefined =
  content != null ? <>{content}</> : undefined;

  const canUpdateTask = user.current?.username === task.assignee?.username && task.status != "Done";

  return (
    <>
      {header}

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Grid container padding={3} gap={2}>
          {canUpdateTask ? (
            <TaskStatusSelector value={task.status} onChange={onChangeStatus} />
          ) : (
            <GridListItem title="Stage">
              <Box display="flex" alignItems="center" gap={1} flexWrap="nowrap">
                <Box sx={{ display: 'inline-flex', alignItems: 'center', transform: 'translateY(-1px)' }}>
                  <StatusMini status={task.status} />
                </Box>
                <Typography
                  component="span"
                  variant="body1"
                  noWrap
                  sx={{ lineHeight: 1, m: 0 }}
                >
                  {toStatusHumanReadable(task.status)}
                </Typography>
              </Box>
            </GridListItem>
          )}
          <GridListItem title="Task description">
            {contentEl}
          </GridListItem>
          <GridListItem title="Assigned by" text={task.author.displayName} />
          {canUpdateTask ? (
            <AssigneeSelector
              value={task.assignee}
              availableValues={users
                ?.filter((u) => u.displayName && u.username !== user.current?.username)
                .sort((a, b) => a.displayName.localeCompare(b.displayName)) ?? []}
              onChange={onChangeAssignee}
            />
          ) : (
            <GridListItem title="Assigned to" text={task.assignee.displayName} />
          )}
          <GridListItem title="Date and time recorded" text={Format.dateAndTimeMobile(task.createdAt)} />

          <GridListItem title="Location" text={task.location ? undefined : "None"}>
            { task.location ?
              <LocationValue entity={task} />
              : undefined
            }
          </GridListItem>

          <GridListItem title="Attachments" text={!task.attachments?.length ? "None" : undefined}>
            {task.attachments?.length ? (
              <Box display="flex" flexDirection="column" gap={1}>
                {task.attachments.map((attachment) => (
                  <AttachmentLink key={attachment.key} attachment={attachment} isOnServer={!task.offline} />
                ))}
              </Box>
            ) : undefined}
          </GridListItem>

          <Typography component={Link} to={`/logbook/${task.incidentId}?taskId=${task.id}`} variant="body1">
              View log entry
          </Typography>
        </Grid>
      </Box>
    </>
  );
};

const IncidentTask = () => {
  const { taskId } = useParams();
  const { data: tasks, isLoading } = useTasks();
  const { users } = useUsers();
  const navigate = useNavigate();
  const isOnline = useIsOnline();

  const task = tasks?.find((task) => task.id === taskId);
  const { startPolling, clearPolling } = useTasksUpdates();

  useEffect(() => {
    if (isOnline && task?.offline) {
      startPolling();
    } else {
      clearPolling();
    }

    return () => {
      clearPolling();
    };
  }, [isOnline, task?.offline, startPolling, clearPolling]);

  const renderHeader = (title: string, navigate: NavigateFunction) => (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        paddingX: { xs: '1rem', md: '60px' },
        paddingTop: '1.3rem'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'inherit',
          textDecoration: 'none',
          mr: 2
        }}
      >
        <PageTitle
          title={title}
          titleStart={
            <IconButton aria-label="Back" onClick={() => { navigate(-1) }} >
              <ArrowBackIcon />
            </IconButton>
          }
        />
      </Box>
    </Box>
  );

  if (isLoading || !tasks) {
    return <TaskFallback header={renderHeader('Loading task...', navigate)} message="Loading task..." />;
  }

  if (!task) {
    return <TaskFallback header={renderHeader('No task found', navigate)} message="Cannot find task." />;
  }

  return <TaskContent header={renderHeader(task.name, navigate)} task={task} users={users ?? []} />;
};

export default IncidentTask;
