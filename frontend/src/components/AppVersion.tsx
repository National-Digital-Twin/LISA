// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Typography } from "@mui/material";

const AppVersion = () => {
  const version = import.meta.env.VITE_LISA_VERSION || 'N/A';

  return (
    <Box className="version">
      <Typography variant="body2">Version {version}</Typography>
    </Box>
  );
}

export default AppVersion;