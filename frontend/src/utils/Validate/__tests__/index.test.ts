/* eslint-disable import/no-extraneous-dependencies */
import { Incident, ReferralWithSupport, ReferralWithoutSupport } from 'common/Incident';
import { LogEntry } from 'common/LogEntry';
import { LogEntryTypes } from 'common/LogEntryTypes';
import type { Field } from 'common/Field';
import { Location } from 'common/Location';
import { Failure, Object } from 'runtypes';
import Validate, { extractErrors, hasValue } from '../index';

jest.mock('common/Incident', () => ({
  Incident: {
    inspect: jest.fn()
  },
  ReferralWithSupport: {
    inspect: jest.fn()
  },
  ReferralWithoutSupport: {
    inspect: jest.fn()
  }
}));

jest.mock('common/LogEntry', () => ({
  LogEntry: {
    inspect: jest.fn()
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
  describe('extractErrors', () => {
    it('should extract errors from a flat details object', () => {
      const details: Failure.Details = {
        field1: {
          success: false,
          code: 'PROPERTY_MISSING',
          message: ''
        } as Failure,
        field2: {
          success: false,
          code: 'INSTANCEOF_FAILED',
          message: ''
        } as Failure,
        field3: {
          success: false,
          code: 'CONTENT_INCORRECT',
          message: '',
          expected: Object({}),
          received: '',
          details: {
            field1: {
              success: false,
              code: 'PROPERTY_MISSING',
              message: ''
            } as Failure
          } as Failure.Details
        },
        field4: {
          success: false,
          code: 'TYPE_INCORRECT',
          message: '',
          expected: Object({}),
          received: '',
          detail: {
            success: false,
            code: 'PROPERTY_MISSING',
            message: ''
          } as Failure
        },
        field5: {
          success: false,
          code: 'CONSTRAINT_FAILED',
          message: '',
          thrown: 'Some constraint failed.',
          expected: Object({}),
          received: ''
        },
        field6: {
          success: false,
          code: 'CONSTRAINT_FAILED',
          message: '',
          thrown: false,
          expected: Object({}),
          received: ''
        }
      };
      const errors = extractErrors(details);
      expect(errors).toEqual([
        { fieldId: 'field1', error: 'Field required.' },
        { fieldId: 'field2', error: 'Unknown error.' },
        { fieldId: 'field3.field1', error: 'Field required.' },
        { fieldId: 'field4', error: 'Field required.' },
        { fieldId: 'field5', error: 'Some constraint failed.' },
        { fieldId: 'field6', error: 'Unknown error.' }
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
        success: false,
        code: 'CONTENT_INCORRECT',
        message: '',
        details: {
          incidentName: {
            success: false,
            code: 'PROPERTY_MISSING',
            message: ''
          } as Failure
        } as Failure.Details
      } as Failure;
      const fakeReferralError = {
        success: false,
        code: 'CONTENT_INCORRECT',
        message: '',
        details: {
          supportDescription: {
            success: false,
            code: 'PROPERTY_MISSING',
            message: ''
          } as Failure
        } as Failure.Details
      } as Failure;

      // Set up mocks.
      (Incident.inspect as jest.Mock).mockReturnValueOnce(fakeIncidentError);
      // Test when support is requested, so use ReferralWithSupport.
      (ReferralWithSupport.inspect as jest.Mock).mockReturnValueOnce(fakeReferralError);

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
        { fieldId: 'incidentName', error: 'Field required.' },
        { fieldId: 'referrer.supportDescription', error: 'Field required.' }
      ]);
    });

    it('should use ReferralWithoutSupport when support is not requested', () => {
      const fakeIncidentError = { details: {}, success: true };
      const fakeReferralError = {
        success: false,
        code: 'CONTENT_INCORRECT',
        message: '',
        details: {
          supportDescription: {
            success: false,
            code: 'PROPERTY_MISSING',
            message: ''
          } as Failure
        } as Failure.Details
      } as Failure;

      (Incident.inspect as jest.Mock).mockReturnValueOnce(fakeIncidentError);
      (ReferralWithoutSupport.inspect as jest.Mock).mockReturnValueOnce(fakeReferralError);

      const incidentData = {
        referrer: {
          supportRequested: 'No'
        }
      } as unknown as Partial<Incident>;

      const errors = Validate.incident(incidentData);
      expect(errors).toEqual([
        { fieldId: 'referrer.supportDescription', error: 'Field required.' }
      ]);
    });
  });

  describe('Validate.entry', () => {
    it('should return errors based on LogEntry.inspect and missing content field', () => {
      // Arrange:
      const fakeEntryError = {
        success: false,
        code: 'CONTENT_INCORRECT',
        message: '',
        details: {
          content: {
            success: false,
            code: 'PROPERTY_MISSING',
            message: ''
          } as Failure
        } as Failure.Details
      } as Failure;
      (LogEntry.inspect as jest.Mock).mockReturnValueOnce(fakeEntryError);

      // Override the type association for the test entry.
      const entryData = {
        type: 'TYPE_A', // this should map to the fakeType
        content: {}, // missing text field
        fields: [],
        location: { type: 'dummy' }
      } as unknown as Partial<LogEntry>;

      // Act:
      const errors = Validate.entry(entryData, []);

      // Assert:
      // Expect the error from LogEntry.validate and missing description.
      expect(errors).toEqual([
        { fieldId: 'content', error: 'Field required.' },
        { fieldId: 'content', error: 'Description required' }
      ]);
    });

    it('should validate custom fields and mentions when provided', () => {
      // Arrange:
      // In this test, LogEntry.inspect succeeds.
      (LogEntry.inspect as jest.Mock).mockReturnValueOnce({ success: true });

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
      const errors = Validate.entry(entryData, []);

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
