import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
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
    label,
  }));

  useEffect(() => {
    setIncludeTask(task?.include === 'Yes');
  }, [task?.include]);

  const onAssigneeChange = (id: string, text: FieldValueType) => {
    const findAssignee = assignees?.find((user) => user.value === text);
    if (findAssignee) {
      onFieldChange(id, {
        username: findAssignee.value,
        displayName: findAssignee.label,
      });
    }
  };

  const onInclTaskChange = (id: string, value: FieldValueType) => {
    setIncludeTask(value === 'Yes');
    onFieldChange(id, value);
  };

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
                onChange={onFieldChange}
                error={
                  showValidationErrors ? Form.getError(NAME_FIELD, validationErrors) : undefined
                }
              />
            </Grid>
            <Grid component="li" size={12}>
              <FormField
                component="li"
                field={{ ...ASSIGNEE_FIELD, value: task?.assignee?.username ?? '', options: assignees ?? [] }}
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
                onChange={onFieldChange}
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
