// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TaskStatus } from 'common/Task';
import { User } from 'common/User';
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import { useAuth, useUsers } from '../hooks';
import { useAllTasks } from '../hooks/useTasks';
import { GridListItem } from '../components/GridListItem';
import AssigneeSelector from '../components/InlineSelectors/AssigneeSelector';
import TaskStatusSelector from '../components/InlineSelectors/TaskStatusSelector';
import { STATUS_LABELS } from '../components/Tasks/utils/statusLabelMapper';
import { Format } from '../utils';
import { logInfo } from '../utils/logger';

const IncidentTask = () => {
  const { taskId } = useParams();
  const { data: tasks } = useAllTasks();
  const { users } = useUsers();
  const navigate = useNavigate();

  const task = tasks?.find((task) => task.id === taskId);

  const { user } = useAuth();

  const header = (
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
          title={task?.name ?? 'Task does not exist'}
          titleStart={
            <IconButton aria-label="Back" onClick={() => { navigate(-1) }} >
              <ArrowBackIcon />
            </IconButton>
          }
        />
      </Box>
    </Box>
  );

  if (!task) {
    return (
      <>
        {header}
        <PageWrapper>
          <Box sx={{ padding: 3 }}>
            <Typography variant="body1">Cannot find task.</Typography>
          </Box>
        </PageWrapper>
      </>
    );
  }

  const onChangeAssignee = (newAssignee: User) => {
    logInfo(`assignee changed to ${newAssignee.displayName}`)
  }

  const onChangeStatus = (newStatus: TaskStatus) => {
    logInfo(`status changed to ${newStatus}`)
  }

  const canUpdateTask = user.current?.username === task?.assignee?.username;

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
            <GridListItem title="Task status" text={STATUS_LABELS[task.status]} />
          )}
          <GridListItem title="Task description" text={task.description} />
          <GridListItem title="Assigned by" text={task.author.displayName} />
          {canUpdateTask ? (
            <AssigneeSelector value={task.assignee} availableValues={users?.filter((u) => u.username !== user.current?.username)} onChange={onChangeAssignee} />
          ) : (
            <GridListItem title="Assigned to" text={task.assignee.displayName} />
          )}
          <GridListItem title="Date and time recorded" text={Format.dateAndTimeMobile(task.createdAt)} />
          <GridListItem title="Location" text="PLACEHOLDER" />
          <GridListItem title="Attachments" text="PLACEHOLDER" />

          <Typography component={Link} to={`/logbook/${task.incidentId}?taskId=${task.id}`} variant="body1">
              View log entry
          </Typography>
        </Grid>
      </Box>
    </>
  );
};

export default IncidentTask;
