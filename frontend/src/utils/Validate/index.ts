// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
/* eslint-disable import/no-extraneous-dependencies */
import { type Field } from 'common/Field';
import { Incident, ReferralWithSupport, ReferralWithoutSupport } from 'common/Incident';
import { Location } from 'common/Location';
import { LogEntry } from 'common/LogEntry';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { Task } from 'common/Task';
/* eslint-enable import/no-extraneous-dependencies */
import { Failure } from 'runtypes';
import { type ValidationError } from '../types';
import Format from '../Format';

function extractErrors(details: Failure.Details, path?: string): Array<ValidationError> {
  const errors: Array<ValidationError> = [];
  errors.push(
    ...Object.keys(details).flatMap((key) => {
      const failure = details[key];
      const fieldId = path ? `${path}.${key}` : key;

      if (failure.code === 'CONTENT_INCORRECT') {
        return extractErrors(failure.details, fieldId);
      }

      if (failure.code === 'PROPERTY_MISSING' || failure.code === 'TYPE_INCORRECT') {
        return { fieldId, error: `Field required.` };
      }

      if (failure.code === 'CONSTRAINT_FAILED') {
        if (typeof failure.thrown === 'string') {
          return { fieldId, error: failure.thrown };
        }
      }

      return { fieldId, error: 'Unknown error.' };
    })
  );

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
    const incidentValidation = Incident.inspect(incident);
    if (!incidentValidation.success && incidentValidation.code === 'CONTENT_INCORRECT') {
      const { details } = incidentValidation;
      errors.push(...extractErrors(details));
    }

    let referrerValidation;
    if (incident.referrer?.supportRequested === 'Yes') {
      referrerValidation = ReferralWithSupport.inspect(incident.referrer);
    } else {
      referrerValidation = ReferralWithoutSupport.inspect(incident.referrer);
    }
    if (!referrerValidation.success && referrerValidation.code === 'CONTENT_INCORRECT') {
      const { details } = referrerValidation;
      errors.push(...extractErrors(details, 'referrer'));
    }

    return errors;
  },
  entry: (entry: Partial<LogEntry>, files: File[]): Array<ValidationError> => {
    const errors: Array<ValidationError> = [];

    // Validate the top-level fields.
    const entryValidation = LogEntry.inspect(entry);
    if (!entryValidation.success && entryValidation.code === 'CONTENT_INCORRECT') {
      const { details } = entryValidation;
      errors.push(...extractErrors(details));
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
        errors.push(...Validate.mentions(entry.content?.json ?? '{}', files));
      }

      // Check the fields if they're supposed to be there...
      const fields = type.fields(entry);
      if (fields.length > 0) {
        fields
          .filter((f) => f.type !== 'Location')
          .forEach((field) => {
            // ... but only if it's editable and not optional.
            if (!Validate.field(field, entry.fields)) {
              errors.push({ fieldId: field.id, error: 'Field required' });
            }
          });
      }

      // Validate the location.
      errors.push(...Validate.location(entry.location, !requireLocation));

      // Validate task entry.
      errors.push(...Validate.task(entry.task));
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
    const mentionables = Format.lexical.mentionables(jsonContent).filter((m) => m.type === 'File');
    const isMissing = mentionables.some((mention) => {
      const [owningEntry, fileName] = mention.id.split('::');
      return owningEntry === 'this' && !files.find((f) => f.name === fileName);
    });
    if (isMissing) {
      return [{ fieldId: 'content', error: 'One or more mentioned files are missing' }];
    }
    return [];
  },
  task: (task: Task | undefined): Array<ValidationError> => {
    const taskValidationErrors: ValidationError[] = [];

    if (task?.include !== 'Yes') {
      return taskValidationErrors;
    }

    if (!task.name) {
      taskValidationErrors.push({ fieldId: 'task_name', error: 'Name required' });
    }

    if (!task.assignee) {
      taskValidationErrors.push({ fieldId: 'task_assignee', error: 'Assignee required' });
    }

    if (!task.description) {
      taskValidationErrors.push({ fieldId: 'task_description', error: 'Description required' });
    }

    return taskValidationErrors;
  }
};

export { extractErrors, hasValue };

export default Validate;
