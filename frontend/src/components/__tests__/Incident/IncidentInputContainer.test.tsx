// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

import { Incident } from 'common/Incident';
import { LogEntry } from 'common/LogEntry';
import { buildSetInfoPayload } from '../../SetInformation/utils';
import { IncidentInputContainer } from '../../Incident/IncidentInputContainer';

// Mocks

jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

jest.mock('../../../utils/Incident/IncidentTypes', () => ({
  IncidentTypes: [
    { value: 'TerrorismNI', label: 'Northern Ireland Terrorism' },
    { value: 'CBRNSmall', label: 'CBRN (Small)' }
  ]
}));

jest.mock('../../AddEntity/EntityInputContainer', () => ({
  EntityInputContainer: ({
    data,
    onSubmit,
    onCancel
  }: {
    data: Array<{ heading: string; inputControls: React.ReactNode }>;
    onSubmit: () => void;
    onCancel: () => void;
  }) => (
    <div>
      <div data-testid="level-0">{data[0]?.inputControls}</div>
      <div data-testid="level-1">{data[1]?.inputControls}</div>
      <button onClick={onSubmit}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}));

jest.mock('../../AddEntity/EntityOptionsContainer', () => ({
  EntityOptionsContainer: ({data}: {
    data: Array<{ id: string; onClick: () => void; label?: string }>;
  }) => (
    <div>
      {data.map((d) => (
        <button key={d.id} onClick={d.onClick}>
          open-{d.id}
        </button>
      ))}
    </div>
  )
}));

jest.mock('@mui/x-date-pickers', () => {
  const actual = jest.requireActual('@mui/x-date-pickers') as Record<string, unknown>;
  type Day = dayjs.Dayjs;

  type PickerBaseProps = {
    label?: string;
    disabled?: boolean;
    value?: Day | string | null;
    onChange: (value: Day | null) => void;
  } & React.InputHTMLAttributes<HTMLInputElement>;

  type LocalizationProviderProps = React.PropsWithChildren<unknown>;

  const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children = undefined }) => (
    <>{children}</>
  );

  const DatePicker: React.FC<PickerBaseProps> = ({ label, onChange, disabled, value, ...rest }) => (
    <input
      aria-label={label || 'Date'}
      placeholder="DD/MM/YYYY"
      disabled={disabled}
      value={value ? dayjs(value).format('YYYY-MM-DD') : ''}
      onChange={(e) => onChange(e.target.value ? dayjs(e.target.value) : null)}
      {...rest}
    />
  );

  const TimeField: React.FC<PickerBaseProps & { disableFuture: boolean }> = ({
    label,
    onChange,
    disabled,
    value,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    disableFuture,
    ...rest
  }) => (
    <input
      aria-label={label || 'Time'}
      placeholder="HH:mm"
      disabled={disabled}
      value={value ? dayjs(value).format('HH:mm') : ''}
      onChange={(e) => onChange(e.target.value ? dayjs(`2000-01-01T${e.target.value}`) : null)}
      {...rest}
    />
  );

  return {
    ...actual,
    LocalizationProvider,
    DatePicker,
    TimeField
  };
});

jest.mock('../../SetInformation/utils', () => ({
  buildSetInfoPayload: jest.fn()
}));

// Helpers

async function pickFromMuiSelect(rootTestId: string, optionText: string) {
  const root = screen.getByTestId(rootTestId);
  const trigger = within(root).getByRole('combobox');
  await userEvent.click(trigger);
  fireEvent.mouseDown(trigger);

  const listbox = await screen.findByRole('listbox');
  await userEvent.click(within(listbox).getByText(optionText));
}

async function fillRequiredFieldsCreateMode() {
  await userEvent.click(screen.getByText('open-type'));
  await pickFromMuiSelect('incident-type-field', 'Northern Ireland Terrorism');

  await userEvent.click(screen.getByText('open-time'));
  const dateInput = screen.getByLabelText(/date/i);
  const timeInput = screen.getByLabelText(/time/i);
  fireEvent.change(dateInput, { target: { value: '2025-01-10' } });
  fireEvent.change(timeInput, { target: { value: '12:34' } });

  // Name
  await userEvent.click(screen.getByText('open-name'));
  const nameInput = screen.getByPlaceholderText(/incident name/i);
  await userEvent.type(nameInput, 'Test Incident');

  // Referrer name
  await userEvent.click(screen.getByText('open-referrer'));
  const refName = screen.getByPlaceholderText(/referred by/i);
  await userEvent.type(refName, 'Jane');

  // Organisation
  await userEvent.click(screen.getByText('open-organisation'));
  const orgInput = screen.getByPlaceholderText(/organisation/i);
  await userEvent.type(orgInput, 'Org Ltd');

  // Phone
  await userEvent.click(screen.getByText('open-phone'));
  const phoneInput = screen.getByPlaceholderText(/telephone number/i);
  await userEvent.type(phoneInput, '+441234567890');

  // Email
  await userEvent.click(screen.getByText('open-email'));
  const emailInput = screen.getByPlaceholderText(/email/i);
  await userEvent.type(emailInput, 'jane@example.com');

  // Support requested Yes + description
  await userEvent.click(screen.getByText('open-supportRequested'));
  await pickFromMuiSelect('support-requested-field', 'Yes');

  const desc = screen.getByPlaceholderText(/describe the support requested/i);
  await userEvent.type(desc, 'We need coordination support.');
}

// Tests

describe('IncidentInputContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create mode: submits full Incident when all required fields are provided', async () => {
    const onSubmit = jest.fn();
    render(<IncidentInputContainer isEditing={false} onSubmit={onSubmit} onCancel={() => {}} />);

    await fillRequiredFieldsCreateMode();

    await userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.mode).toBe('create');

    const incident = (payload as { mode: 'create'; incident: Incident }).incident;

    expect(incident.id).toBe('test-uuid');
    expect(incident.type).toBe('TerrorismNI');
    expect(incident.name).toBe('Test Incident');
    expect(incident.referrer?.name).toBe('Jane');
    expect(incident.referrer?.organisation).toBe('Org Ltd');
    expect(incident.referrer?.telephone).toBe('+441234567890');
    expect(incident.referrer?.email).toBe('jane@example.com');
    expect(incident.referrer?.supportRequested).toBe('Yes');
    expect(incident.referrer?.supportDescription).toContain('coordination');

    expect(dayjs(incident.startedAt).isValid()).toBe(true);
    expect(dayjs(incident.startedAt).hour()).toBe(12);
    expect(dayjs(incident.startedAt).minute()).toBe(34);
  });

  test('supportRequested: shows and hides description field based on selection', async () => {
    render(<IncidentInputContainer isEditing={false} onSubmit={jest.fn()} onCancel={() => {}} />);

    await userEvent.click(screen.getByText('open-supportRequested'));

    expect(
      screen.queryByPlaceholderText(/describe the support requested/i)
    ).not.toBeInTheDocument();

    await pickFromMuiSelect('support-requested-field', 'Yes');
    expect(screen.getByPlaceholderText(/describe the support requested/i)).toBeInTheDocument();

    await pickFromMuiSelect('support-requested-field', 'No');
    expect(
      screen.queryByPlaceholderText(/describe the support requested/i)
    ).not.toBeInTheDocument();
  });

  test('edit mode: hides type and time fields', async () => {
    const initialIncident: Incident = {
      id: 'inc-1',
      type: 'TerrorismNI',
      name: 'Existing',
      stage: 'Monitoring',
      startedAt: dayjs('2025-01-02T09:15:00Z').toISOString(),
      referrer: {
        name: 'Bob',
        organisation: 'Org',
        telephone: '123',
        email: 'b@x.com',
        supportRequested: 'No'
      }
    };

    render(
      <IncidentInputContainer
        isEditing
        initialIncident={initialIncident}
        onSubmit={jest.fn()}
        onCancel={() => {}}
      />
    );

    expect(screen.queryByText('open-type')).not.toBeInTheDocument();
    expect(screen.queryByText('open-time')).not.toBeInTheDocument();

    // Other fields should still be visible
    expect(screen.getByText('open-name')).toBeInTheDocument();
    expect(screen.getByText('open-referrer')).toBeInTheDocument();
  });

  test('create mode: shows type and time fields', async () => {
    render(<IncidentInputContainer isEditing={false} onSubmit={jest.fn()} onCancel={() => {}} />);

    expect(screen.getByText('open-type')).toBeInTheDocument();
    expect(screen.getByText('open-time')).toBeInTheDocument();
  });

  test('edit mode: submits SetIncidentInformation log entry (dirty only) via utils', async () => {
    const onSubmit = jest.fn();

    const initialIncident: Incident = {
      id: 'inc-1',
      type: 'TerrorismNI',
      name: 'Existing',
      stage: 'Monitoring',
      startedAt: dayjs('2025-01-02T09:15:00Z').toISOString(),
      referrer: {
        name: 'Bob',
        organisation: 'Org',
        telephone: '123',
        email: 'b@x.com',
        supportRequested: 'No'
      }
    };

    (buildSetInfoPayload as jest.Mock).mockReturnValue({
      entry: {
        type: 'SetIncidentInformation',
        incidentId: 'inc-1',
        fields: [{ id: 'name', value: 'Changed' }]
      } as Partial<LogEntry>,
      isDirty: true
    });

    render(
      <IncidentInputContainer
        isEditing
        initialIncident={initialIncident}
        onSubmit={onSubmit}
        onCancel={() => {}}
      />
    );

    await userEvent.click(screen.getByText('open-name'));
    const nameInput = screen.getByPlaceholderText(/incident name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    await userEvent.type(nameInput, 'Changed');

    await userEvent.click(screen.getByText('Submit'));

    expect(buildSetInfoPayload).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.mode).toBe('edit');

    const entry = (payload as { mode: 'edit'; logEntry: Partial<LogEntry> }).logEntry;
    expect(entry.type).toBe('SetIncidentInformation');
    expect(entry.incidentId).toBe('inc-1');
    expect(entry.fields).toEqual([{ id: 'name', value: 'Changed' }]);
  });

  test('edit mode: does not submit when no changes (isDirty=false)', async () => {
    const onSubmit = jest.fn();

    const initialIncident: Incident = {
      id: 'inc-1',
      type: 'TerrorismNI',
      name: 'Existing',
      stage: 'Monitoring',
      startedAt: dayjs('2025-01-02T09:15:00Z').toISOString(),
      referrer: {
        name: 'Bob',
        organisation: 'Org',
        telephone: '123',
        email: 'b@x.com',
        supportRequested: 'No'
      }
    };

    (buildSetInfoPayload as jest.Mock).mockReturnValue({
      entry: { type: 'SetIncidentInformation', incidentId: 'inc-1', fields: [] },
      isDirty: false
    });

    render(
      <IncidentInputContainer
        isEditing
        initialIncident={initialIncident}
        onSubmit={onSubmit}
        onCancel={() => {}}
      />
    );

    await userEvent.click(screen.getByText('Submit'));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
