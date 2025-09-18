// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useCallback, useMemo, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Box, Button, FormControl, ListSubheader, MenuItem, TextField } from '@mui/material';
import { IncidentTypes as INCIDENT_TYPE_OPTIONS } from '../../utils/Incident/IncidentTypes';
import { ValidationError } from '../../utils/types';
import { EntityInputContainer, EntityInputContainerData } from '../AddEntity/EntityInputContainer';
import { EntityOptionsContainer } from '../AddEntity/EntityOptionsContainer';
import { EntityOptionData } from '../AddEntity/EntityOptions';
import { Incident, Referrer } from 'common/Incident';
import { IncidentType } from 'common/IncidentType';
import { FieldOption } from 'common/Field';
import { LogEntry } from 'common/LogEntry';
import { buildSetInfoPayload } from '../SetInformation/utils';
import { logError } from '../../utils/logger';
import { DateAndTimePicker } from '../DateAndTimePicker';
import { useTemporaryState } from '../../hooks/useTemporaryState';

type SubmitPayload =
  | { mode: 'create'; incident: Incident }
  | { mode: 'edit'; logEntry: Partial<LogEntry> };

type Props = {
  isEditing: boolean;
  initialIncident?: Incident;
  onSubmit: (payload: SubmitPayload) => void;
  onCancel: () => void;
};

type FieldType =
  | 'type'
  | 'time'
  | 'name'
  | 'referrer'
  | 'organisation'
  | 'phone'
  | 'email'
  | 'supportRequested';

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
  isEditing,
  initialIncident,
  onSubmit,
  onCancel
}: Readonly<Props>) => {
  const [level, setLevel] = useState<number>(0);
  const [activeField, setActiveField] = useState<FieldType | null>(null);

  const [incident, setIncident] = useState<Partial<Incident>>(
    initialIncident
      ? { ...initialIncident }
      : {
        id: uuidV4(),
        stage: 'Monitoring',
        name: '',
        referrer: {
          name: '',
          organisation: '',
          telephone: '',
          email: ''
        } as Referrer
      }
  );

  type EditableState = {
    incident: Partial<Incident>;
  };

  const tempState = useTemporaryState<EditableState>();

  const validateIncident = useCallback((incident: Partial<Incident>): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!incident.type) {
      errors.push({ fieldId: 'incident_type', error: 'Incident type is required' });
    }

    if (incident.startedAt) {
      const now = new Date();
      const value = new Date(incident.startedAt);

      if (value > now) {
        errors.push({ fieldId: 'incident_time', error: 'Incident time cannot be in the future' });
      }
    } else {
      errors.push({ fieldId: 'incident_time', error: 'Incident time is required' });
    }

    if (!incident.name?.trim()) {
      errors.push({ fieldId: 'incident_name', error: 'Incident name is required' });
    }

    const r = incident.referrer;

    if (!r?.name) {
      errors.push({
        fieldId: 'incident_referrer',
        error: 'Referred by is required'
      });
    }

    if (!r?.organisation) {
      errors.push({
        fieldId: 'incident_referrer_organisation',
        error: 'Organisation is required'
      });
    }

    if (r?.telephone) {
      const telephoneFormat = /^\+?\d[\d\s]+\d$/;

      if (!telephoneFormat.test(r.telephone)) {
        errors.push({
          fieldId: 'incident_referrer_telephone',
          error: 'Phone No is not in a valid format'
        });
      }
    } else {
      errors.push({
        fieldId: 'incident_referrer_telephone',
        error: 'Phone No is required'
      });
    }

    if (!r?.email) {
      errors.push({
        fieldId: 'incident_email',
        error: 'Email is required'
      });
    }

    if (!r?.supportRequested) {
      errors.push({
        fieldId: 'incident_supportRequested',
        error: 'Please choose Yes or No'
      });
    }

    if (r?.supportRequested === 'Yes' && !r.supportDescription?.trim()) {
      errors.push({
        fieldId: 'incident_supportDescription',
        error: 'Please describe the support requested'
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

  const isDirty = useMemo(() => {
    if (!isEditing || !initialIncident) return true;

    if (errors.length > 0) return false;

    try {
      const { isDirty } = buildSetInfoPayload(incident as Incident, initialIncident);
      return isDirty;
    } catch (err) {
      logError('Error building log entry payload', err);
      return false;
    }
  }, [isEditing, initialIncident, incident, errors.length]);

  const setLevelAndClearState = (level: number, confirmed: boolean = false) => {
    if (level === 0) {
      if (!confirmed) {
        const saved = tempState.getSaved();
        if (saved) {
          setIncident(saved.incident);
        }
      }
      tempState.clear();
    }

    setLevel(level);
    setActiveField(null);
  };

  const getFieldError = (fieldId: string) => errors.find((e) => e.fieldId === fieldId);

  const activateField = (field: FieldType) => {
    tempState.save({ incident });

    setActiveField(field);
    setLevel(1);
  };

  const onIncidentChange = (updates: Partial<Incident>) => {
    setIncident((prev) => ({ ...prev, ...updates }));
  };

  const onReferrerChange = (patch: Partial<NonNullable<Incident['referrer']>>) => {
    setIncident((prev) => {
      const merged = { ...(prev.referrer ?? {}), ...patch };

      if (merged.supportRequested === 'Yes') {
        const next: Extract<NonNullable<Incident['referrer']>, { supportRequested: 'Yes' }> = {
          email: merged.email ?? '',
          name: merged.name ?? '',
          organisation: merged.organisation ?? '',
          telephone: merged.telephone ?? '',
          supportRequested: 'Yes',
          supportDescription: merged.supportDescription ?? ''
        };
        return { ...prev, referrer: next };
      }

      if (merged.supportRequested === 'No') {
        const next: Extract<NonNullable<Incident['referrer']>, { supportRequested: 'No' }> = {
          email: merged.email ?? '',
          name: merged.name ?? '',
          organisation: merged.organisation ?? '',
          telephone: merged.telephone ?? '',
          supportRequested: 'No'
        };
        return { ...prev, referrer: next };
      }

      return { ...prev, referrer: merged as unknown as NonNullable<Incident['referrer']> };
    });
  };

  const handleSupportRequestedChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const v = e.target.value;
    if (v === 'Yes') {
      onReferrerChange({ supportRequested: 'Yes' });
    } else if (v === 'No') {
      onReferrerChange({ supportRequested: 'No', supportDescription: '' });
    } else {
      onReferrerChange({ supportRequested: undefined });
    }
  };

  const renderIncidentMenuItems = (
    items: Array<{ value: string; label: string; options?: FieldOption[] }>
  ) =>
    items.flatMap((item) =>
      item.options?.length
        ? [
          <ListSubheader key={`group-${item.value || item.label}`}>{item.label}</ListSubheader>,
          ...item.options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label ?? opt.value}
            </MenuItem>
          ))
        ]
        : [
          <MenuItem key={item.value} value={item.value}>
            {item.label ?? item.value}
          </MenuItem>
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

  const displayValue = (v?: string) => (typeof v === 'string' && v.trim() === '' ? undefined : v);

  const entityOptionData: EntityOptionData[] = (Object.keys(fieldConfigs) as FieldType[])
    .filter((field) => !isEditing || (field !== 'type' && field !== 'time'))
    .map((field) => ({
      id: field,
      onClick: () => activateField(field),
      value: displayValue(getFieldValue(field) as string | undefined),
      required: fieldConfigs[field].required,
      supportedOffline: fieldConfigs[field].supportedOffline
    }));

  function finalizeIncident(i: Partial<Incident>): Incident {
    return i as Incident;
  }

  const handleSubmit = () => {
    if (errors.length > 0) return;

    assertValidIncident(incident);
    const full = finalizeIncident(incident);

    if (isEditing && initialIncident) {
      const { entry, isDirty } = buildSetInfoPayload(full, initialIncident);
      if (!isDirty) return;
      onSubmit({ mode: 'edit', logEntry: entry });
    } else {
      onSubmit({ mode: 'create', incident: full });
    }
  };

  const renderFieldInput = () => {
    if (!activeField) return null;

    const isDirty = tempState.hasChanges({
      incident
    });

    const srError = getFieldError('incident_supportRequested');
    const sdError = getFieldError('incident_supportDescription');

    const fieldInput = (() => {
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
                disabled={isEditing}
                data-testid="incident-type-field"
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
              <DateAndTimePicker
                dateLabel="Date"
                timeLabel="Time"
                disableFuture
                value={incident.startedAt}
                onChange={(d: string | undefined, t: string | undefined) => {
                  if (!d && !t) {
                    onIncidentChange({ startedAt: undefined });
                    return;
                  }
                  const parseDate = Date.parse(`${d}T${t}`);
                  if (!Number.isNaN(parseDate)) {
                    onIncidentChange({ startedAt: new Date(`${d}T${t}`).toISOString() });
                  }
                }}
              />
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
                data-testid="support-requested-field"
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
    })();

    return (
      <Box>
        {fieldInput}
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Button
            onClick={() => setLevelAndClearState(0, true)}
            variant="contained"
            disabled={!isDirty}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    );
  };

  const inputContainerData: EntityInputContainerData[] = [
    {
      heading: isEditing ? 'Edit incident' : ' Add new incident',
      inputControls: (
        <EntityOptionsContainer entityType="incidents" data={entityOptionData} errors={errors} />
      ),
      showButtons: true
    },
    {
      heading: activeField ? fieldConfigs[activeField].heading : '',
      inputControls: <Box flexGrow={1}>{renderFieldInput()}</Box>
    }
  ];

  return (
    <EntityInputContainer
      data={inputContainerData}
      onMainBackClick={onCancel}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      level={level}
      setLevel={(newLevel) => setLevelAndClearState(newLevel, false)}
      disableSubmit={errors.length > 0 || (isEditing && !isDirty)}
    />
  );
};
