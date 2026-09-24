// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { Typography } from '@mui/material';
import BaseInlineSelector from './BaseInlineSelector';
import { User } from 'common/User';

type Props = {
  value: User;
  availableValues?: User[];
  onChange: (next: User) => void;
  disabled?: boolean;
};

export default function AssigneeSelector({
  value,
  availableValues = [],
  onChange,
  disabled = false
}: Readonly<Props>) {
  return (
    <BaseInlineSelector<User>
      label="Assigned to"
      disabled={disabled}
      valueNode={<Typography variant="body1">{value?.displayName}</Typography>}
      options={availableValues}
      onChange={onChange}
      getOptionKey={(u) => u.username}
      isSelected={(u) => u.username === value?.username}
      renderOption={(u) => ({
        label: u.displayName,
      })}
      idSeed="assignee"
    />
  );
}