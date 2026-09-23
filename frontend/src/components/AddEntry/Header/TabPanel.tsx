// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { Box } from '@mui/material';
import React from 'react';

type TabPanelProps = {
  children: React.ReactNode;
  hash: string;
  value: string;
};

const TabPanel = ({ children, hash, value }: TabPanelProps) => (
  <Box
    role="tabpanel"
    hidden={!value.includes(hash)}
    id={`tabpanel-${value}`}
    aria-labelledby={`tabpanel-${value}`}
  >
    {value === hash && children}
  </Box>
);

export default TabPanel;
