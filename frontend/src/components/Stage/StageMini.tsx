// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { Box } from '@mui/material';

const StageMini = ({
  stage,
  size = 12
}: {
  stage: 'Monitoring' | 'Response' | 'Recovery' | 'Closed';
  size?: number;
}) => {
  const color = stage.toLowerCase();
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: `stage.${color}.secondary`,
        border: 1,
        borderColor: `stage.${color}.primary`,
        display: 'inline-block'
      }}
    />
  );
};

export default StageMini;
