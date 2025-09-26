// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Typography } from '@mui/material';
import BaseInlineSelector from './BaseInlineSelector';
import { TaskStatus } from 'common/Task';
import StatusMini from '../Tasks/StatusMini';
import { STATUS_LABELS, toStatusHumanReadable } from '../Tasks/utils/statusLabelMapper';

const NEXT_STATUSES: { readonly [K in TaskStatus]: readonly TaskStatus[] } = {
  ToDo: ['InProgress', 'Done'],
  InProgress: ['Done'],
  Done: [],
} as const;

type Props = {
  value: TaskStatus;
  onChange: (next: TaskStatus) => void;
  disabled?: boolean;
};

export default function TaskStatusSelector({ value, onChange, disabled = false }: Readonly<Props>) {
  const options = NEXT_STATUSES[value];

  return (
    <BaseInlineSelector<TaskStatus>
      label="Status"
      disabled={disabled}
      valueNode={
        <>
          <StatusMini status={value} />
          <Typography variant="body1">{toStatusHumanReadable(value)}</Typography>
        </>
      }
      options={options}
      onChange={onChange}
      getOptionKey={(s) => s}
      isSelected={(s) => s === value}
      renderOption={(s) => ({
        icon: <StatusMini status={s} />,
        label: STATUS_LABELS[s],
      })}
      idSeed="task-status"
    />
  );
}