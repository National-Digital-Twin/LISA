// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ReactNode } from 'react';
import { Box, IconButton } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { EntityLabel } from './EntityLabel';
import { useIsOnline } from '../../hooks/useIsOnline';

type Props = {
  onClick: () => void;
  icon: ReactNode;
  errored: boolean;
  required: boolean;
  value: string | undefined;
  supportedOffline: boolean;
  label: string;
  removable: boolean;
  onRemove: () => void;
};

export const EntityOption = ({
  onClick,
  icon,
  errored,
  required,
  value,
  supportedOffline,
  label,
  removable,
  onRemove
}: Props) => {
  const isOnline = useIsOnline();
  const isAvailable = supportedOffline || isOnline;

  const clickableEntityOption = (
    <Box
      display="flex"
      textAlign="left"
      padding="10px 5px"
      gap={1}
      sx={{ cursor: isAvailable ? 'pointer' : 'initial' }}
      onClick={isAvailable ? onClick : undefined}
      flexGrow={removable ? 1 : 'initial'}
    >
      {icon}
      <EntityLabel errored={errored} required={required} value={value} label={label} />
    </Box>
  );

  if (removable) {
    return (
      <Box display="flex" justifyContent="space-between">
        {clickableEntityOption}
        <IconButton onClick={onRemove}>
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
    );
  }

  return clickableEntityOption;
};
