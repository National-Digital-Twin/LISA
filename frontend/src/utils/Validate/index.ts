// Local imports
/* eslint-disable import/no-extraneous-dependencies */
import { type Field } from 'common/Field';
import { Incident, ReferralWithSupport, ReferralWithoutSupport } from 'common/Incident';
import { Location } from 'common/Location';
import { LogEntry } from 'common/LogEntry';
import { LogEntryTypes } from 'common/LogEntryTypes';
/* eslint-enable import/no-extraneous-dependencies */
import { type ValidationError } from '../types';
import Format from '../Format';

type Details = {
  [key in string | number | symbol]: string | Details;
};

function getErrorText(error: string): string {
  if (error?.startsWith('Failed constraint check')) {
    return error.split(':').pop()?.trim() ?? '';
  }
  return 'Field required';
}

function extractErrors(details: Details, path?: string): Array<ValidationError> {
  const errors = [];
  if (details) {
    errors.push(...Object.keys(details).flatMap((key) => {
      const error = details[key];
      const fieldId = path ? `${path}.${key}` : key;
      if (typeof error === 'string') {
        return { fieldId, error: getErrorText(error) };
      }
      return extractErrors(error, fieldId);
    }));
  }
  return errors;
}

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return !!value;
}

const Validate = {
  incident: (incident: Partial<Incident>): Array<ValidationError> => {
    const errors = [];
    const incidentValidation = Incident.validate(incident);
    if (!incidentValidation.success && incidentValidation.details) {
      const { details } = incidentValidation;
      errors.push(...extractErrors(details as Details));
    }

    let referrerValidation;
    if (incident.referrer?.supportRequested === 'Yes') {
      referrerValidation = ReferralWithSupport.validate(incident.referrer);
    } else {
      referrerValidation = ReferralWithoutSupport.validate(incident.referrer);
    }
    if (!referrerValidation.success && referrerValidation.details) {
      const { details } = referrerValidation;
      errors.push(...extractErrors(details as Details, 'referrer'));
    }

    return errors;
  },
  entry: (entry: Partial<LogEntry>, files: File[]): Array<ValidationError> => {
    const errors: Array<ValidationError> = [];

    // Validate the top-level fields.
    const entryValidation = LogEntry.validate(entry);
    if (!entryValidation.success && entryValidation.details) {
      const { details } = entryValidation;
      errors.push(...extractErrors(details as Details));
    }

    if (entry.type) {
      const type = LogEntryTypes[entry.type];
      const { noContent, requireLocation } = type;

      // Check the textual content if it's needed.
      if (!noContent && !hasValue(entry.content?.text)) {
        errors.push({ fieldId: 'content', error: 'Description required' });
      }

      // Check any mentions are valid
      if (!noContent && hasValue(entry.content?.json)) {
        errors.push(...Validate.mentions((entry.content?.json ?? '{}'), files));
      }

      // Check the fields if they're supposed to be there...
      const fields = type.fields(entry);
      if (fields.length > 0) {
        fields.filter((f) => f.type !== 'Location').forEach((field) => {
          // ... but only if it's editable and not optional.
          if (!Validate.field(field, entry.fields)) {
            errors.push({ fieldId: field.id, error: 'Field required' });
          }
        });
      }

      // Validate the location.
      errors.push(...Validate.location(entry.location, !requireLocation));
    }

    return errors;
  },
  field: (field: Field, allFields?: Array<Field>): boolean => {
    if (field.optional || field.type === 'Label') {
      return true;
    }
    return hasValue(allFields?.find((f) => f.id === field.id)?.value);
  },
  location: (location: Location | undefined, noneAllowed = false): Array<ValidationError> => {
    if (!location?.type) {
      if (noneAllowed) {
        return [];
      }
      return [{ fieldId: 'location.type', error: 'Location required' }];
    }

    if (!noneAllowed && location.type === 'none') {
      return [{ fieldId: 'location.type', error: 'Location required' }];
    }

    return [];
  },
  mentions: (jsonContent: string, files: File[]): Array<ValidationError> => {
    const mentionables = Format.lexical.mentionables(jsonContent)
      .filter((m) => m.type === 'File');
    const isMissing = mentionables.some((mention) => {
      const [owningEntry, fileName] = mention.id.split('::');
      return owningEntry === 'this' && !files.find((f) => f.name === fileName);
    });
    if (isMissing) {
      return [{ fieldId: 'content', error: 'One or more mentioned files are missing' }];
    }
    return [];
  }
};

export default Validate;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
