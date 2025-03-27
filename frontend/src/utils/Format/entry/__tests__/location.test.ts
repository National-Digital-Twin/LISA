/* eslint-disable import/no-extraneous-dependencies */
import { LogEntryType } from 'common/LogEntryType';
import type { LogEntry } from 'common/LogEntry';
import { Coordinates } from 'common/Location';
import { location, VIEW_LOCATION } from '../location';

// Minimal stub types for LogEntry and FullLocationType used for tests.
type FullLocationType = {
  type: string;
  description?: string;
  coordinates: Coordinates;
};

interface FakeLogEntry {
  id?: string;
  incidentId: string;
  type: LogEntryType;
  dateTime: string;
  location: FullLocationType;
}

describe('location', () => {
  it('returns the description when provided', () => {
    const fakeEntry: FakeLogEntry = {
      incidentId: '123',
      type: 'General',
      dateTime: '2021-01-01T00:00:00Z',
      location: {
        type: 'coordinates',
        description: 'Test location description',
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      }
    };

    const result = location(fakeEntry as Partial<LogEntry>);
    expect(result).toBe('Test location description');
  });

  it(`returns VIEW_LOCATION if description is not provided but location exists`, () => {
    const fakeEntry: FakeLogEntry = {
      dateTime: '',
      incidentId: '',
      type: 'Action',
      location: {
        type: 'address',
        // description is undefined
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      }
    };

    const result = location(fakeEntry as Partial<LogEntry>);
    expect(result).toBe(VIEW_LOCATION);
  });

  it('returns empty string if no location is provided', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const fakeEntry: FakeLogEntry = {};
    const result = location(fakeEntry as Partial<LogEntry>);
    expect(result).toBe('');
  });

  it('returns empty string if location type is "none"', () => {
    const fakeEntry: FakeLogEntry = {
      dateTime: '',
      incidentId: '',
      type: 'Action',
      location: {
        type: 'none',
        description: 'Should not be returned',
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      }
    };

    const result = location(fakeEntry as Partial<LogEntry>);
    expect(result).toBe('');
  });
});
