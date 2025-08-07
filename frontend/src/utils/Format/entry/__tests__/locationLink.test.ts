 
import { LogEntry } from 'common/LogEntry';
import { locationLink } from '../locationLink';

// Define a minimal fake LogEntry for testing.
interface FakeLogEntry {
  id?: string;
  incidentId?: string;
  location?: {
    type: string;
    coordinates?: [number, number];
  };
}

describe('locationLink', () => {
  it('returns a link if location exists with coordinates', () => {
    const fakeEntry: FakeLogEntry = {
      id: 'log123',
      incidentId: 'inc456',
      location: {
        type: 'address',
        coordinates: [12.34, 56.78]
      }
    };

    const result = locationLink(fakeEntry as Partial<LogEntry>);
    expect(result).toBe('/location/inc456#log123');
  });

  it('returns undefined if location exists but coordinates are missing', () => {
    const fakeEntry: FakeLogEntry = {
      id: 'log123',
      incidentId: 'inc456',
      location: {
        type: 'address'
        // No coordinates provided
      }
    };

    const result = locationLink(fakeEntry as Partial<LogEntry>);
    expect(result).toBeUndefined();
  });

  it('returns undefined if location is not provided', () => {
    const fakeEntry: FakeLogEntry = {
      id: 'log123',
      incidentId: 'inc456'
      // No location property
    };

    const result = locationLink(fakeEntry as Partial<LogEntry>);
    expect(result).toBeUndefined();
  });
});
