/* eslint-disable import/no-extraneous-dependencies */
import { LogEntryTypes } from 'common/LogEntryTypes';
import type { Incident } from 'common/Incident';
import { LogEntry } from 'common/LogEntry';
import { LogEntryType } from 'common/LogEntryType';
import { getBaseLogEntryFields } from '../getBaseLogEntryFields';

// We mock the LogEntryTypes module to control its behaviour in the tests.
jest.mock('common/LogEntryTypes', () => ({
  LogEntryTypes: {
    General: {
      label: 'General',
      dateLabel: 'Occurred at'
    },
    Specific: {
      label: 'Specific Log',
      dateLabel: 'Event time',
      unselectable: (incident?: Partial<Incident>) =>
        // If the incident has a property "offline" set to true, mark this type as unselectable.
        !!incident?.offline
    },
    Extra: {
      label: 'Extra Log'
      // No dateLabel is defined so defaults should be used.
    }
  }
}));

describe('getBaseLogEntryFields', () => {
  it('should return two base fields when no incident or entry is provided', () => {
    const fields = getBaseLogEntryFields();
    expect(Array.isArray(fields)).toBe(true);
    expect(fields).toHaveLength(2);

    // The First field is the "type" select field
    const typeField = fields[0];
    expect(typeField).toHaveProperty('id', 'type');
    expect(typeField).toHaveProperty('type', 'Select');
    expect(typeField).toHaveProperty('label', 'Category');

    // Options should contain all keys from LogEntryTypes (with filtering applied)
    const { options } = typeField;
    expect(Array.isArray(options)).toBe(true);
    // Since no incident is passed, unselectable for Specific should return false.

    const expectedOptions = Object.keys(LogEntryTypes).map((key) => ({
      value: key,
      label: LogEntryTypes[key as LogEntryType]?.label ?? LogEntryTypes.General.label
    }));
    expect(options).toEqual(expectedOptions);

    // The Second field is the date/time field
    const dateTimeField = fields[1];
    expect(dateTimeField).toHaveProperty('id', 'dateTime');
    expect(dateTimeField).toHaveProperty('type', 'DateTime');
    // Should use the default label from DATE_TIME_FIELD as no entry provided.
    expect(dateTimeField).toHaveProperty('label', 'Date and time occurred');
  });

  it('should override the dateTime label if entry type has a dateLabel', () => {
    const mockedLogEntryTypes = LogEntryTypes as Record<
      string,
      {
        label: string;
        dateLabel?: string;
        unselectable?: (incident?: Partial<Incident>) => boolean;
      }
    >;

    // Provide entry with type "Specific" which has a dateLabel ("Event time")
    const entry = { type: 'Specific' } as unknown as Partial<LogEntry>;
    const fields = getBaseLogEntryFields(undefined, entry);

    // The Second field should have labelled overridden to "Event time."
    const dateTimeField = fields[1];
    expect(dateTimeField).toHaveProperty('id', 'dateTime');
    expect(dateTimeField).toHaveProperty('type', 'DateTime');
    expect(dateTimeField).toHaveProperty('label', mockedLogEntryTypes.Specific.dateLabel);
  });

  it('should filter out unselectable log entry types based on incident', () => {
    // Create an incident object that causes the "Specific" type to be unselectable.
    const incident = { offline: true };
    const fields = getBaseLogEntryFields(incident);

    const typeField = fields[0];
    expect(typeField).toHaveProperty('id', 'type');
    expect(typeField).toHaveProperty('type', 'Select');
    expect(typeField).toHaveProperty('label', 'Category');

    // "Specific" should be filtered out.
    const { options } = typeField;
    // "Specific" should not be found among the options.
    const optionValues = options?.map((o) => o.value);
    expect(optionValues).not.toContain('Specific');

    // Other types (General and Extra) should still be included.
    expect(optionValues).toContain('General');
    expect(optionValues).toContain('Extra');
  });

  it('should use default dateTime field when entry type does not have a dateLabel', () => {
    // Provide entry with type "Extra" which does not define a dateLabel.
    const entry = { incidentId: 'id-1', type: 'Action' as const, dateTime: '2021-01-01T00:00:00Z' };
    const fields = getBaseLogEntryFields(undefined, entry);

    const dateTimeField = fields[1];
    // Falls back to the default DATE_TIME_FIELD label.
    expect(dateTimeField).toHaveProperty('label', 'Date and time occurred');
  });

  it('should use default dateTime label when entry type does not have a dateLabel', () => {
    // Provide entry with type "Extra" which does not define a dateLabel.
    const entry = {
      incidentId: 'id-1',
      type: 'Specific',
      dateTime: '2021-01-01T00:00:00Z',
      dateLabel: 'Date and time handover completed'
    } as unknown as Partial<LogEntry>;

    const fields = getBaseLogEntryFields(undefined, entry);

    const dateTimeField = fields[1];
    // Falls back to the default DATE_TIME_FIELD label.
    expect(dateTimeField).toHaveProperty('label', 'Event time');
  });
});
