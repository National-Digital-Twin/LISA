// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, Tab, Box, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const tabErrors = useMemo(() => ({
    form: validationErrors.filter(e => !e.fieldId.startsWith('location') && !e.fieldId.startsWith('task')),
    location: validationErrors.filter(e => e.fieldId.startsWith('location')),
    task: validationErrors.filter(e => e.fieldId.startsWith('task')),
  }), [validationErrors]);

  const { hash } = useLocation();
  const { isMobile } = useResponsive();
  const active = hash || TABS.FORM;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const navigate = useNavigate();
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };


  const tabMeta = [
    { label: 'Form', value: TABS.FORM, errors: tabErrors.form },
    { label: 'Location', value: TABS.LOCATION, errors: tabErrors.location },
    { label: `Files (${fileCount})`, value: TABS.FILES, errors: [] },
    { label: 'Sketch', value: TABS.SKETCH, errors: [] },
    { label: 'Task', value: TABS.TASK, errors: tabErrors.task }
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return () => {};
    }
  
    const handleScroll = () => {
      const shouldShow =
        el.scrollWidth > el.clientWidth &&
        el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setShowScrollHint(shouldShow);
    };
  
    handleScroll();
    el.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
  
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);
  

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          justifyContent: isMobile ? 'flex-start' : 'flex-end',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        <Tabs
          value={active}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons={false}
          TabIndicatorProps={{
            style: {
              backgroundColor: showValidationErrors ? 'error.main' : 'primary.main'
            }
          }}
          sx={{
            minWidth: 'max-content',
          }}
        >
          {tabMeta.map(({ label, value, errors }) => {
            const hasError = errors.length > 0;
            const tooltipText = (
              <>
                {errors.map((e, i) => (
                  <React.Fragment key={i}>
                    {e.error}
                    <br />
                  </React.Fragment>
                ))}
              </>
            );

            const tabComponent = (
              <Tab
                key={value}
                id={`log-tab-${value}`}
                aria-controls={`log-tab-${value}`}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  color: hasError ? 'error.main' : 'inherit',
                  '&.Mui-selected': {
                    color: hasError ? 'error.main' : 'primary.main',
                  },
                }}
                component={Link}
                to={value}
                value={value}
                label={
                  hasError ? (
                    <Tooltip title={tooltipText} placement="top" arrow>
                      <span>{`${label}*`}</span>
                    </Tooltip>
                  ) : (
                    label
                  )
                }
              />
            );

            return tabComponent;
          })}
        </Tabs>
      </Box>

      {showScrollHint && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 24,
            height: '100%',
            pointerEvents: 'none',
            background: 'linear-gradient(to left, rgba(255,255,255,0.9), rgba(255,255,255,0))',
            transition: 'opacity 0.2s ease-in-out',
            opacity: showScrollHint ? 1 : 0,
          }}
        />      
      )}
    </Box>
  );
}

