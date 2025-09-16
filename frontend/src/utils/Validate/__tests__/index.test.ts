import { Incident, ReferralWithSupport, ReferralWithoutSupport } from 'common/Incident';
import { LogEntry } from 'common/LogEntry';
import { LogEntryTypes } from 'common/LogEntryTypes';
import type { Field } from 'common/Field';
import { Location } from 'common/Location';
import Validate, { getErrorText, extractErrors, hasValue } from '../index';

jest.mock('common/Incident', () => ({
  Incident: {
    validate: jest.fn()
  },
  ReferralWithSupport: {
    validate: jest.fn()
  },
  ReferralWithoutSupport: {
    validate: jest.fn()
  }
}));

jest.mock('common/LogEntry', () => ({
  LogEntry: {
    validate: jest.fn()
  }
}));

jest.mock('common/LogEntryTypes', () => ({
  LogEntryTypes: {
    TYPE_A: {
      noContent: false,
      requireLocation: false,
      fields: (entry: { fields?: Field[] }) => entry.fields || []
    }
  }
}));

jest.mock('../../Format', () => ({
  lexical: {
    mentionables: jest.fn(() =>
      // Return a predictable value for testing purposes.
      // For example, an empty array.
      []
    )
  }
}));

describe('Helper functions', () => {
  describe('getErrorText', () => {
    it('should return the trimmed message after the colon when error starts with "Failed constraint check"', () => {
      const error = 'Failed constraint check: Some specific error occurred';
      expect(getErrorText(error)).toBe('Some specific error occurred');
    });

    it('should return "Field required" when error does not start with the expected text', () => {
      expect(getErrorText('Other error')).toBe('Field required');
    });

    it('should return "Field required" when provided an empty string', () => {
      expect(getErrorText('')).toBe('Field required');
    });
  });

  describe('extractErrors', () => {
    it('should extract errors from a flat details object', () => {
      const details = {
        field1: 'Failed constraint check: Missing value',
        field2: 'Some other error'
      };
      const errors = extractErrors(details);
      expect(errors).toEqual([
        { fieldId: 'field1', error: 'Missing value' },
        { fieldId: 'field2', error: 'Field required' }
      ]);
    });

    it('should extract errors recursively with proper path', () => {
      const details = {
        parent: {
          child1: 'Failed constraint check: Invalid input',
          child2: 'Error message'
        }
      };
      const errors = extractErrors(details);
      expect(errors).toEqual([
        { fieldId: 'parent.child1', error: 'Invalid input' },
        { fieldId: 'parent.child2', error: 'Field required' }
      ]);
    });
  });

  describe('hasValue', () => {
    it('should return true for non-empty arrays', () => {
      expect(hasValue([1, 2, 3])).toBe(true);
    });

    it('should return false for an empty array', () => {
      expect(hasValue([])).toBe(false);
    });

    it('should return true for truthy values', () => {
      expect(hasValue('hello')).toBe(true);
    });

    it('should return false for falsy values', () => {
      expect(hasValue(null)).toBe(false);
      expect(hasValue(undefined)).toBe(false);
      expect(hasValue(0)).toBe(false);
    });
  });
});

describe('Validate functions', () => {
  // Stub Validate.mentions and Validate.location when needed.

  describe('Validate.field', () => {
    it('should return true for optional fields', () => {
      const field = { id: 'optionalField', optional: true, type: 'Text' } as unknown as Field;
      expect(Validate.field(field)).toBe(true);
    });

    it('should return true for Label type fields', () => {
      const field = { id: 'labelField', optional: false, type: 'Label' } as unknown as Field;
      expect(Validate.field(field)).toBe(true);
    });

    it('should return true when the field exists with a value', () => {
      const field = { id: 'requiredField', optional: false, type: 'Text' } as unknown as Field;
      const allFields = [{ id: 'requiredField', value: 'Some value' }] as unknown as Field[];
      expect(Validate.field(field, allFields)).toBe(true);
    });

    it('should return false when the field does not have a value', () => {
      const field = { id: 'requiredField', optional: false, type: 'Text' } as unknown as Field;
      const allFields = [{ id: 'requiredField', value: '' }] as unknown as Field[];
      expect(Validate.field(field, allFields)).toBe(false);
    });
  });

  describe('Validate.incident', () => {
    it('should return errors for incident and referrer validations', () => {
      // Arrange:
      const fakeIncidentError = {
        details: { incidentField: 'Failed constraint check: Incident missing' },
        success: false
      };
      const fakeReferralError = {
        details: { ref_error: 'Failed constraint check: Referrer error' },
        success: false
      };

      // Set up mocks.
      (Incident.validate as jest.Mock).mockReturnValueOnce(fakeIncidentError);
      // Test when support is requested, so use ReferralWithSupport.
      (ReferralWithSupport.validate as jest.Mock).mockReturnValueOnce(fakeReferralError);

      const incidentData = {
        someProperty: 'value',
        referrer: {
          supportRequested: 'Yes'
        }
      } as unknown as Partial<Incident>;

      // Act:
      const errors = Validate.incident(incidentData);

      // Assert:
      expect(errors).toEqual([
        { fieldId: 'incidentField', error: 'Incident missing' },
        { fieldId: 'referrer.ref_error', error: 'Referrer error' }
      ]);
    });

    it('should use ReferralWithoutSupport when support is not requested', () => {
      const fakeIncidentError = { details: {}, success: true };
      const fakeReferralError = {
        details: { ref_error: 'Failed constraint check: No support error' },
        success: false
      };

      (Incident.validate as jest.Mock).mockReturnValueOnce(fakeIncidentError);
      (ReferralWithoutSupport.validate as jest.Mock).mockReturnValueOnce(fakeReferralError);

      const incidentData = {
        referrer: {
          supportRequested: 'No'
        }
      } as unknown as Partial<Incident>;

      const errors = Validate.incident(incidentData);
      expect(errors).toEqual([{ fieldId: 'referrer.ref_error', error: 'No support error' }]);
    });
  });

  describe('Validate.entry', () => {
    it('should return errors based on LogEntry.validate and missing content field', () => {
      // Arrange:
      const fakeEntryError = {
        details: { entryField: 'Failed constraint check: Invalid entry' },
        success: false
      };
      (LogEntry.validate as jest.Mock).mockReturnValueOnce(fakeEntryError);

      // Override the type association for the test entry.
      const entryData = {
        type: 'TYPE_A', // this should map to the fakeType
        content: {}, // missing text field
        fields: [],
        location: { type: 'dummy' }
      } as unknown as Partial<LogEntry>;

      // Act:
      const errors = Validate.entry(entryData, [], new Date().toString());

      // Assert:
      // Expect the error from LogEntry.validate and missing description.
      expect(errors).toEqual([
        { fieldId: 'entryField', error: 'Invalid entry' },
        { fieldId: 'content', error: 'Description required' }
      ]);
    });

    it('should validate custom fields and mentions when provided', () => {
      // Arrange:
      // In this test, LogEntry.validate succeeds.
      (LogEntry.validate as jest.Mock).mockReturnValueOnce({ success: true });

      // Fake type for the entry.
      const fakeField = { id: 'customField', type: 'Text' };

      // Override the LogEntryTypes so that the given type returns our fakeType.
      (LogEntryTypes as Record<string, unknown>).TYPE_B = {
        noContent: false,
        requireLocation: false,
        fields: () => [fakeField]
      };

      const entryData = {
        type: 'TYPE_B',
        content: { text: 'A valid description', json: '{}' },
        fields: [] // missing the custom field value
      } as unknown as Partial<LogEntry>;

      // Act:
      const errors = Validate.entry(entryData, [], new Date().toString());

      // Assert:
      expect(errors).toContainEqual({ fieldId: 'customField', error: 'Field required' });
    });
  });
  describe('Validate.location', () => {
    it('should return no error when location is missing and noneAllowed is true', () => {
      const result = Validate.location(undefined, true);
      expect(result).toEqual([]);
    });

    it('should return an error when location is missing and noneAllowed is false', () => {
      const location = {
        type: 'none'
      } as unknown as Location;
      const result = Validate.location(location, false);
      expect(result).toEqual([{ fieldId: 'location.type', error: 'Location required' }]);
    });
  });
  describe('Validate.mentions', () => {
    it('should return an empty array when Format.lexical.mentionables is mocked to return an empty array', () => {
      const json = '{}';
      const files: File[] = [];

      const result = Validate.mentions(json, files);
      expect(result).toEqual([]);
    });
  });
});
