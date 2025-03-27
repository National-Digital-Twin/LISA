// eslint-disable-next-line import/no-extraneous-dependencies
import { LocationTypes } from 'common/Location';
import { type Field } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
import Format, { VIEW_LOCATION } from '../../Format';
import { getFieldValue } from '../getFieldValue';

describe('getFieldValue for field.type === "Location"', () => {
  const originalLocationLink = Format.entry.locationLink;
  const originalLocation = Format.entry.location;

  afterEach(() => {
    Format.entry.locationLink = originalLocationLink;
    Format.entry.location = originalLocation;
  });

  const mockField: Field = { id: 'test-field-id', type: 'Location' };

  it('should return LocationTypes.coordinates when href exists and text equals VIEW_LOCATION', () => {
    // Arrange
    const entry: Partial<LogEntry> = {};

    // Mock implementations for Format functions
    Format.entry.locationLink = jest.fn(() => 'some-link');
    Format.entry.location = jest.fn(() => VIEW_LOCATION);

    // Act
    const result = getFieldValue(mockField, entry);

    // Assert
    expect(Format.entry.locationLink).toHaveBeenCalledWith(entry);
    expect(Format.entry.location).toHaveBeenCalledWith(entry);
    expect(result).toBe(LocationTypes.coordinates);
  });

  it('should return text when href exists and text does not equal VIEW_LOCATION', () => {
    // Arrange
    const entry: Partial<LogEntry> = {};
    const customText = 'Custom Location Text';

    // Mock implementations for Format functions
    Format.entry.locationLink = jest.fn(() => 'some-link');
    Format.entry.location = jest.fn(() => customText);

    // Act
    const result = getFieldValue(mockField, entry);

    // Assert
    expect(Format.entry.locationLink).toHaveBeenCalledWith(entry);
    expect(Format.entry.location).toHaveBeenCalledWith(entry);
    expect(result).toBe(customText);
  });

  it('should return an empty string when href is falsy and text equals VIEW_LOCATION', () => {
    // Arrange
    const entry: Partial<LogEntry> = {};

    // Mock implementations for Format functions
    Format.entry.locationLink = jest.fn(() => undefined);
    Format.entry.location = jest.fn(() => VIEW_LOCATION);

    // Act
    const result = getFieldValue(mockField, entry);

    // Assert
    expect(Format.entry.locationLink).toHaveBeenCalledWith(entry);
    expect(Format.entry.location).toHaveBeenCalledWith(entry);
    expect(result).toBe('');
  });

  it('should return text when href is falsy and text does not equal VIEW_LOCATION', () => {
    // Arrange
    const entry: Partial<LogEntry> = {};
    const customText = 'Another Location Text';

    // Mock implementations for Format functions
    Format.entry.locationLink = jest.fn(() => undefined);
    Format.entry.location = jest.fn(() => customText);

    // Act
    const result = getFieldValue(mockField, entry);

    // Assert
    expect(Format.entry.locationLink).toHaveBeenCalledWith(entry);
    expect(Format.entry.location).toHaveBeenCalledWith(entry);
    expect(result).toBe(customText);
  });
});
