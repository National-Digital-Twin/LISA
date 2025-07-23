// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { ElementType } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Local imports
import { type Field } from 'common/Field';
import { type FieldGroup } from 'common/FieldGroup';
import { type LogEntry } from 'common/LogEntry';

import { Form } from '../../utils';
import { type OnFieldChange } from '../../utils/handlers';
import { type ValidationError } from '../../utils/types';
import FormField from './FormField';

type Props = {
  group: FieldGroup;
  fields: Array<Field>;
  entry: Partial<LogEntry>;
  entries?: Array<Partial<LogEntry>>;
  validationErrors: Array<ValidationError>;
  onFieldChange: OnFieldChange;
  component?: ElementType;
  showValidationErrors: boolean;
};

export default function FormGroup({
  group,
  fields,
  entry,
  entries = undefined,
  validationErrors,
  onFieldChange,
  component = undefined,
  showValidationErrors
}: Readonly<Props>) {
  if (!Form.groupHasFields(group, fields)) {
    return null;
  }

  if (group.label) {
    return (
      <Accordion defaultExpanded={group.defaultOpen} elevation={0}>
        <AccordionSummary
          sx={{ backgroundColor: 'border.default' }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>{group.label}</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            backgroundColor: 'background.default',
            borderLeft: '1px solid',
            borderRight: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'border.main'
          }}
        >
          <Box component="ul" display="flex" flexDirection="column" gap={2} padding={1}>
            {group.description && (
              <Typography component="li" variant="body1">
                {group.description}
              </Typography>
            )}
            {fields
              .filter((f) => group.fieldIds.includes(f.id))
              .map((field) => (
                <FormField
                  component="li"
                  key={field.id}
                  field={{
                    ...field,
                    value: Form.getFieldValue(field, entry)
                  }}
                  entries={entries}
                  error={showValidationErrors ? Form.getError(field, validationErrors) : undefined}
                  onChange={onFieldChange}
                  className={field.className}
                />
              ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }

  return fields
    .filter((f) => group.fieldIds.includes(f.id))
    .map((field) => (
      <FormField
        component={component}
        key={field.id}
        field={{
          ...field,
          value: Form.getFieldValue(field, entry)
        }}
        entries={entries}
        error={showValidationErrors ? Form.getError(field, validationErrors) : undefined}
        onChange={onFieldChange}
        className={field.className}
      />
    ));
}
