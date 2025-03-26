import { Chip } from '@mui/material';

const Stage = ({
  label,
  stage,
  size = 'medium',
  width = 120
}: {
  label: string;
  stage: 'Monitoring' | 'Response' | 'Recovery' | 'Closed';
  size?: 'small' | 'medium';
  width?: string | number;
}) => {
  const color = stage.toLowerCase();
  return (
    <Chip
      label={label}
      size={size}
      sx={{
        width,
        border: 1,
        borderColor: `stage.${color}.primary`,
        backgroundColor: `stage.${color}.secondary`
      }}
      variant="filled"
    />
  );
};

export default Stage;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
