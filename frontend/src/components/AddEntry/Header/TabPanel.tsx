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
