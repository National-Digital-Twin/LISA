// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useCallback, useMemo, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Box, FormControl, ListSubheader, MenuItem, TextField } from '@mui/material';
import { IncidentTypes as INCIDENT_TYPE_OPTIONS } from '../../utils/Incident/IncidentTypes';
import { ValidationError } from '../../utils/types';
import { EntityInputContainer, EntityInputContainerData } from '../AddEntity/EntityInputContainer';
import { EntityOptionsContainer } from '../AddEntity/EntityOptionsContainer';
import { EntityOptionData } from '../AddEntity/EntityOptions';
import { Incident, Referrer } from 'common/Incident';
import { IncidentType } from 'common/IncidentType';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FieldOption } from 'common/Field';

type Props = {
  onSubmit: (incident: Incident) => void;
  onCancel: () => void;
};

type FieldType = 'type' | 'time' | 'name' | 'referrer' | 'organisation' | 'phone' | 'email' | 'supportRequested';

const fieldConfigs = {
  type: { heading: 'Incident type', required: true, supportedOffline: true },
  time: { heading: 'Date and time', required: true, supportedOffline: true },
  name: { heading: 'Incident name', required: true, supportedOffline: true },
  referrer: { heading: 'Referred by', required: true, supportedOffline: true },
  organisation: { heading: 'Organisation', required: true, supportedOffline: true },
  phone: { heading: 'Telephone number', required: true, supportedOffline: false },
  email: { heading: 'Email', required: true, supportedOffline: true },
  supportRequested: { heading: 'Support requested?', required: true, supportedOffline: true }
};

export const IncidentInputContainer = ({
  onSubmit,
  onCancel
}: Readonly<Props>) => {
  const [level, setLevel] = useState<number>(0);
  const [activeField, setActiveField] = useState<FieldType | null>(null);

  const [incident, setIncident] = useState<Partial<Incident>>({
    name: '',
    id: uuidV4(),
    stage: 'Monitoring',
    referrer: {
      name: '',
      organisation: '',
      telephone: '',
      email: '',
    } as Referrer,
  });

  const validateIncident = useCallback((incident: Partial<Incident>): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!incident.type) {
      errors.push({ fieldId: 'incident_type', error: 'Incident type is required' });
    }

    if (!incident.startedAt) {
      errors.push({ fieldId: 'incident_time', error: 'Incident time is required' });
    }
  
    if (!incident.name?.trim()) {
      errors.push({ fieldId: 'incident_name', error: 'Incident name is required' });
    }
  
    const r = incident.referrer;

    if (!r?.name) {
      errors.push({
        fieldId: 'incident_referrer',
        error: 'Referred by is required',
      });
    }

    if (!r?.organisation) {
      errors.push({
        fieldId: 'incident_organisation',
        error: 'Organisation is required',
      });
    }

    if (!r?.telephone) {
      errors.push({
        fieldId: 'incident_phone',
        error: 'Phone No is required',
      });
    }

    if (!r?.email) {
      errors.push({
        fieldId: 'incident_email',
        error: 'Email is required',
      });
    }
  
    if (!r?.supportRequested) {
      errors.push({
        fieldId: 'incident_supportRequested',
        error: 'Please choose Yes or No',
      });
    }
    
    if (r?.supportRequested === 'Yes' && !r.supportDescription?.trim()) {
      errors.push({
        fieldId: 'incident_supportDescription',
        error: 'Please describe the support requested',
      });
    }
  
    return errors;
  }, []);

  function assertValidIncident(i: Partial<Incident>): asserts i is Incident {
    const errs = validateIncident(i);
    if (errs.length) {
      throw new Error('Incident is invalid');
    }
  }

  const YES_NO = ['Yes', 'No'] as const;

  const errors = useMemo(() => validateIncident(incident), [incident, validateIncident]);

  const setLevelAndClearState = (level: number) => {
    setLevel(level);
    setActiveField(null);
  };

  const getFieldError = (fieldId: string) => errors.find((e) => e.fieldId === fieldId);

  const activateField = (field: FieldType) => {
    setActiveField(field);
    setLevel(1);
  };

  const onIncidentChange = (updates: Partial<Incident>) => {
    setIncident((prev) => ({ ...prev, ...updates }));
  };

  const onReferrerChange = (
    patch: Partial<NonNullable<Incident['referrer']>>
  ) => {
    setIncident((prev) => {
      const merged = { ...(prev.referrer ?? {}), ...patch };

      if (merged.supportRequested === 'Yes') {
        const next: Extract<NonNullable<Incident['referrer']>, { supportRequested: 'Yes' }> = {
          email: merged.email ?? '',
          name: merged.name ?? '',
          organisation: merged.organisation ?? '',
          telephone: merged.telephone ?? '',
          supportRequested: 'Yes',
          supportDescription: merged.supportDescription ?? '',
        };
        return { ...prev, referrer: next };
      }
  
      if (merged.supportRequested === 'No') {
        const next: Extract<NonNullable<Incident['referrer']>, { supportRequested: 'No' }> = {
          email: merged.email ?? '',
          name: merged.name ?? '',
          organisation: merged.organisation ?? '',
          telephone: merged.telephone ?? '',
          supportRequested: 'No',
        };
        return { ...prev, referrer: next };
      }
  
      return { ...prev, referrer: merged as unknown as NonNullable<Incident['referrer']> };
    });
  };

  const handleSupportRequestedChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const v = e.target.value;
    if (v === 'Yes') {
      onReferrerChange({ supportRequested: 'Yes' });
    } else if (v === 'No') {
      onReferrerChange({ supportRequested: 'No', supportDescription: '' });
    } else {
      onReferrerChange({ supportRequested: undefined });
    }
  };

  const handleSubmit = () => {
    if (errors.length > 0) return;
  
    assertValidIncident(incident);
  
    onSubmit(incident);
  };

  const renderIncidentMenuItems = (items: Array<{ value: string; label: string; options?: FieldOption[] }>) =>
    items.flatMap((item) =>
      item.options?.length
        ? [
          <ListSubheader key={`group-${item.value || item.label}`}>{item.label}</ListSubheader>,
          ...item.options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label ?? opt.value}
            </MenuItem>
          )),
        ]
        : [
          <MenuItem key={item.value} value={item.value}>
            {item.label ?? item.value}
          </MenuItem>,
        ]
    );

  const getFieldValue = (field: FieldType) => {
    switch (field) {
      case 'type':
        return incident.type;
      case 'time':
        return incident.startedAt;
      case 'name':
        return incident.name;
      case 'referrer':
        return incident.referrer?.name;
      case 'organisation':
        return incident.referrer?.organisation;
      case 'phone':
        return incident.referrer?.telephone;
      case 'email':
        return incident.referrer?.email;
      case 'supportRequested':
        return incident.referrer?.supportRequested;
    }
  };

  const displayValue = (v?: string) =>
    typeof v === 'string' && v.trim() === '' ? undefined : v;

  const entityOptionData: EntityOptionData[] = (Object.keys(fieldConfigs) as FieldType[]).map(
    (field) => ({
      id: field,
      onClick: () => activateField(field),
      value: displayValue(getFieldValue(field) as string | undefined),
      required: fieldConfigs[field].required,
      supportedOffline: fieldConfigs[field].supportedOffline
    })
  );

  const renderFieldInput = () => {
    if (!activeField) return null;

    const srError = getFieldError('incident_supportRequested');
    const sdError = getFieldError('incident_supportDescription');

    switch (activeField) {
      case 'type':
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              select
              value={incident.type || ''}
              variant="filled"
              label={incident.type ? '' : 'Select incident type'}
              onChange={(e) => onIncidentChange({ type: e.target.value as IncidentType })}
              slotProps={{ inputLabel: { shrink: false } }}
              error={!!getFieldError('incident_type')}
              helperText={getFieldError('incident_type')?.error}
            >
              {!incident.type && (
                <MenuItem value="" disabled>
            Select incident type
                </MenuItem>
              )}
              {renderIncidentMenuItems(INCIDENT_TYPE_OPTIONS)}
            </TextField>
          </FormControl>
        );

      case 'time':
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" flexDirection="column" gap={2}>
                <DatePicker
                  label="Date"
                  value={incident.startedAt ? dayjs(incident.startedAt) : null}
                  onChange={(newDate) => {
                    if (!newDate) {
                      onIncidentChange({ startedAt: undefined });
                      return;
                    }
                    const base = incident.startedAt ? dayjs(incident.startedAt) : dayjs();
                    const updated = base
                      .year(newDate.year())
                      .month(newDate.month())
                      .date(newDate.date())
                      .second(0)
                      .millisecond(0);
                    onIncidentChange({ startedAt: updated.toISOString() });
                  }}
                  slotProps={{ textField: { variant: 'filled', fullWidth: true, InputLabelProps: { shrink: true }, error: !!getFieldError('incident_time') } }}
                />
                <TimePicker
                  label="Time"
                  value={incident.startedAt ? dayjs(incident.startedAt) : null}
                  onChange={(newTime) => {
                    if (!newTime) {
                      onIncidentChange({ startedAt: undefined });
                      return;
                    }
                    const base = incident.startedAt ? dayjs(incident.startedAt) : dayjs();
                    const updated = base
                      .hour(newTime.hour())
                      .minute(newTime.minute())
                      .second(0)
                      .millisecond(0);
                    onIncidentChange({ startedAt: updated.toISOString() });
                  }}
                  slotProps={{ textField: { variant: 'filled', fullWidth: true, InputLabelProps: { shrink: true }, error: !!getFieldError('incident_time') } }}
                />
              </Box>
            </LocalizationProvider>
          </FormControl>
        );

      case 'name':
        return (
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <TextField
              hiddenLabel
              variant="filled"
              placeholder="Incident name"
              value={incident.name || ''}
              onChange={(event) => onIncidentChange({ name: event.target.value })}
              error={!!getFieldError('incident_name')}
              helperText={getFieldError('incident_name')?.error}
            />
          </FormControl>
        );

      case 'referrer':
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              hiddenLabel
              variant="filled"
              placeholder="Referred by"
              value={incident.referrer?.name ?? ''}
              onChange={(e) => onReferrerChange({ name: e.target.value })}
              error={!!getFieldError('incident_referrer')}
              helperText={getFieldError('incident_referrer')?.error}
            />
          </FormControl>
        );

      case 'organisation':
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              hiddenLabel
              variant="filled"
              placeholder="Organisation"
              value={incident.referrer?.organisation ?? ''}
              onChange={(e) => onReferrerChange({ organisation: e.target.value })}
              error={!!getFieldError('incident_referrer_organisation')}
              helperText={getFieldError('incident_referrer_organisation')?.error}
            />
          </FormControl>
        );

      case 'phone':
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              hiddenLabel
              variant="filled"
              placeholder="Telephone number"
              type="tel"
              value={incident.referrer?.telephone ?? ''}
              onChange={(e) => onReferrerChange({ telephone: e.target.value })}
              error={!!getFieldError('incident_referrer_telephone')}
              helperText={getFieldError('incident_referrer_telephone')?.error}
            />
          </FormControl>
        );

      case 'email':
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              hiddenLabel
              variant="filled"
              placeholder="Email"
              type="email"
              value={incident.referrer?.email ?? ''}
              onChange={(e) => onReferrerChange({ email: e.target.value })}
              error={!!getFieldError('incident_referrer_email')}
              helperText={getFieldError('incident_referrer_email')?.error}
            />
          </FormControl>
        );

      case 'supportRequested':
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              select
              variant="filled"
              label={
                incident.referrer?.supportRequested
                  ? ''
                  : 'Has the referrer requested support from the local resilience team?'
              }
              value={incident.referrer?.supportRequested ?? ''}
              onChange={handleSupportRequestedChange}
              slotProps={{ inputLabel: { shrink: false } }}
              error={!!srError}
              helperText={srError?.error}
            >
              <MenuItem value="" disabled>
                  Select yes/no
              </MenuItem>
              {YES_NO.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
        
            {incident.referrer?.supportRequested === 'Yes' && (
              <TextField
                fullWidth
                sx={{ mt: 2 }}
                variant="filled"
                hiddenLabel
                placeholder="Describe the support requested"
                multiline
                minRows={3}
                value={incident.referrer?.supportDescription ?? ''}
                onChange={(e) => onReferrerChange({ supportDescription: e.target.value })}
                error={!!sdError}
                helperText={sdError?.error}
              />
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  const inputContainerData: EntityInputContainerData[] = [
    {
      heading: 'Add new incident',
      inputControls: (
        <EntityOptionsContainer entityType="incidents" data={entityOptionData} errors={errors} />
      )
    },
    {
      heading: activeField ? fieldConfigs[activeField].heading : '',
      inputControls: <Box flexGrow={1}>{renderFieldInput()}</Box>,
      hideButtons: true
    }
  ];

  return (
    <EntityInputContainer
      data={inputContainerData}
      onMainBackClick={onCancel}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      level={level}
      setLevel={setLevelAndClearState}
      disableSubmit={errors.length > 0}
    />
  );
};
