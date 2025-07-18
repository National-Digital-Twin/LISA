// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Grid2 as Grid } from '@mui/material';
import { type LogEntry } from 'common/LogEntry';
import { useEffect, useState } from 'react';
import { type User } from 'common/User';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Task } from 'common/Task';
import { FormField } from '../../Form';

import { OnFieldChange } from '../../../utils/handlers';
import { FieldValueType, ValidationError } from '../../../utils/types';
import { Form, Format } from '../../../utils';
import { ASSIGNEE_FIELD, DESC_FIELD, INCLUDE_FIELD, NAME_FIELD } from './constants';

type TaskContentProps = {
  task: Partial<Task> | undefined;
  entries: Array<Partial<LogEntry>> | undefined;
  onFieldChange: OnFieldChange;
  users: User[] | undefined;
  validationErrors: Array<ValidationError>;
  showValidationErrors: boolean;
};

const TaskContent = ({
  task,
  entries,
  onFieldChange,
  users,
  validationErrors,
  showValidationErrors
}: TaskContentProps) => {
  const [includeTask, setIncludeTask] = useState<boolean>(false);

  const assignees = users?.map(Format.mentionable.user).map(({ id, label }) => ({
    value: id,
    label
  }));

  const fieldIdToTaskKeyMap: Record<string, string> = {
    task_name: 'name',
    task_assignee: 'assignee',
    task_description: 'description'
  };

  useEffect(() => {
    setIncludeTask(task?.include === 'Yes');
  }, [task?.include]);

  const onAssigneeChange = (_:string, text: FieldValueType) => {
    const findAssignee = assignees?.find((user) => user.value === text);
    if (findAssignee) {
      onFieldChange('assignee', {
        username: findAssignee.value,
        displayName: findAssignee.label
      });
    }
  };

  const onInclTaskChange = (id: string, value: FieldValueType) => {
    setIncludeTask(value === 'Yes');
    onFieldChange(id, value);
  };

  const onTaskInputChange = (id: string, value: FieldValueType) => {
    const mappedKey = fieldIdToTaskKeyMap[id] ?? id;
    onFieldChange(mappedKey, value);
  }

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Grid component="ul" container spacing={4}>
        <Grid component="li" size={12}>
          <FormField
            component="li"
            field={{ ...INCLUDE_FIELD, value: task?.include }}
            error={undefined}
            onChange={onInclTaskChange}
          />
        </Grid>

        {includeTask && (
          <>
            <Grid component="li" size={12}>
              <FormField
                component="li"
                field={{ ...NAME_FIELD, value: task?.name }}
                entries={entries}
                onChange={onTaskInputChange}
                error={
                  showValidationErrors ? Form.getError(NAME_FIELD, validationErrors) : undefined
                }
              />
            </Grid>
            <Grid component="li" size={12}>
              <FormField
                component="li"
                field={{
                  ...ASSIGNEE_FIELD,
                  value: task?.assignee?.username ?? '',
                  options: assignees ?? []
                }}
                entries={entries}
                onChange={onAssigneeChange}
                error={
                  showValidationErrors ? Form.getError(ASSIGNEE_FIELD, validationErrors) : undefined
                }
              />
            </Grid>

            <Grid component="li" size={12}>
              <FormField
                component="li"
                field={{ ...DESC_FIELD, value: task?.description }}
                entries={entries}
                onChange={onTaskInputChange}
                error={
                  showValidationErrors ? Form.getError(DESC_FIELD, validationErrors) : undefined
                }
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default TaskContent;
