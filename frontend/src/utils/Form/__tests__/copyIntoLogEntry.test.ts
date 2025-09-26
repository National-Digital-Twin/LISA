import { type LogEntry } from 'common/LogEntry';
import { copyIntoLogEntry } from '../copyIntoLogEntry';

import { updateLogEntry } from '../updateLogEntry';

jest.mock('../updateLogEntry', () => ({
  updateLogEntry: jest.fn((entry) => entry)
}));

describe('copyIntoLogEntry', () => {
  beforeEach(() => {
    (updateLogEntry as jest.Mock).mockClear();
  });

  it('should merge fields from original and copyFrom', () => {
    const original: Partial<LogEntry> = {
      fields: [
        {
          id: 'field1',
          type: 'Select'
        },
        {
          id: 'field2',
          type: 'SelectLogEntry'
        }
      ]
    };
    const copyFrom: Partial<LogEntry> = {
      fields: [
        {
          id: 'field2',
          type: 'Location'
        },
        {
          id: 'field3',
          type: 'Select'
        }
      ],
      location: {
        type: 'none'
      }
    };

    const result = copyIntoLogEntry(original, copyFrom);

    expect(result.fields).toEqual([
      {
        id: 'field1',
        type: 'Select'
      },
      {
        id: 'field2',
        type: 'SelectLogEntry'
      },
      {
        id: 'field2',
        type: 'Location'
      },
      {
        id: 'field3',
        type: 'Select'
      }
    ]);
  });

  describe('location type determination', () => {
    it('should set location type as "both" when coordinates and description exist', () => {
      const original: Partial<LogEntry> = {};
      const copyFrom: Partial<LogEntry> = {
        location: {
          type: 'both',
          description: 'This location has both a description and coordinates',
          coordinates: [{
            latitude: 40.7128,
            longitude: -74.006
          }]
        }
      };

      const result = copyIntoLogEntry(original, copyFrom);

      expect(result.location).toEqual({
        ...copyFrom.location,
        type: 'both'
      });
    });

    it('should set location type as "coordinates" when coordinates and description does not exist', () => {
      const original: Partial<LogEntry> = {};
      const copyFrom: Partial<LogEntry> = {
        location: {
          type: 'coordinates',
          coordinates: [{
            latitude: 40.7128,
            longitude: -74.006
          }]
        }
      };

      const result = copyIntoLogEntry(original, copyFrom);

      expect(result.location).toEqual({
        ...copyFrom.location,
        type: 'coordinates'
      });
    });
  });
});
