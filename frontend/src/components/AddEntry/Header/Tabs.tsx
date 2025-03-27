// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import React, { useMemo, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { type ValidationError } from '../../../utils/types';
import { TABS } from '../constants';
import { useResponsive } from '../../../hooks/useResponsiveHook';

interface Props {
  fileCount: number;
  validationErrors: Array<ValidationError>;
  showValidationErrors: boolean;
}
export default function TabNavigation({
  fileCount,
  validationErrors,
  showValidationErrors
}: Readonly<Props>) {
  const { isMobile } = useResponsive();
  const hasLocationError: boolean = useMemo(
    () => !!validationErrors.find((e) => e.fieldId.startsWith('location')),
    [validationErrors]
  );
  const hasFormError: boolean = useMemo(
    () => !!validationErrors.find((e) => !e.fieldId.startsWith('location')),
    [validationErrors]
  );

  const [active, setActive] = useState(TABS.FORM);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setActive(newValue);
  };

  const tabMeta = [
    { label: 'Form', value: TABS.FORM, error: hasFormError },
    { label: 'Location', value: TABS.LOCATION, error: hasLocationError },
    { label: `Files (${fileCount})`, value: TABS.FILES },
    { label: 'Sketch', value: TABS.SKETCH }
  ];

  return (
    <Box display="flex" justifyContent="flex-end" width="100%">
      <Tabs
        value={active}
        onChange={handleChange}
        variant={isMobile ? 'fullWidth' : 'standard'}
        TabIndicatorProps={{
          style: { backgroundColor: showValidationErrors ? 'error.main' : 'primary.main' }
        }}
        sx={{
          '& .Mui-selected': {
            color: showValidationErrors ? 'error.main' : 'primary.main'
          },
          '& .MuiTabs-indicator': {
            backgroundColor: showValidationErrors ? 'error.main' : 'primary.main'
          }
        }}
      >
        {tabMeta.map(({ label, value, error }) => (
          <Tab
            key={value}
            id={`log-tab-${value}`}
            aria-controls={`log-tab-${value}`}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            component={Link}
            to={value}
            label={error ? `${label}*` : label}
            value={value}
          />
        ))}
      </Tabs>
    </Box>
  );
}
