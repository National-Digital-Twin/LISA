// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box } from '@mui/material';
// Local imports
import { type LogEntry } from 'common/LogEntry';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';
import bem from '../../../bem';
import { FieldItem } from './FieldItem';
import { GroupItem } from './GroupItem';

const classes = bem('log-entry-fields');

export function fields(entry: LogEntry) {
  const type = LogEntryTypes[entry.type];
  if (!type) {
    return null;
  }

  const entryFields = type.fields(entry);
  if (entryFields.length > 0) {
    if (type.groups) {
      return (
        <div className={classes()}>
          {type.groups.map((group) => (
            <GroupItem key={group.id} group={group} fields={entryFields} entry={entry} />
          ))}
        </div>
      );
    }
    return (
      <Box component="ul" display="flex" flexDirection="column" gap={0.75} width="100%">
        {entryFields.map((field) => (
          <FieldItem key={field.id} field={field} entry={entry} />
        ))}
      </Box>
    );
  }
  return null;
}
