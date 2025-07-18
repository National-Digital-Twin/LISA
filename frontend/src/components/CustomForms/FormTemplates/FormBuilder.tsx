// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { UiSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';
import { useNavigate } from 'react-router-dom';
import SortableFieldRow from "./SortableFieldRow"
import { generateFieldKey } from '../utils';
import { Field } from './types';
import { useCreateFormTemplate } from '../../../hooks/Forms/useFormTemplates';
import { MAX_FORM_LABEL_LENGTH } from '../constants';

type Props = {
  onSchemaChange: (schema: JSONSchema7, uiSchema: UiSchema) => void;
};

const createNewField = (): Field => ({
  id: nanoid(),
  label: '',
  type: 'string',
});

const FormBuilder = ({ onSchemaChange }: Props) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [formTitle, setFormTitle] = useState('Untitled Form');

  const [labelErrors, setLabelErrors] = useState<Record<string, string>>({});
  const [titleError, setTitleError] = useState('');
  const [isValid, setIsValid] = useState(true);


  const { mutate: createForm } = useCreateFormTemplate();
  const navigate = useNavigate();

  const generateSchema = useCallback(() => {
    const requiredFields = fields
      .filter((f) => f.required)
      .map((f) => generateFieldKey(f));
  
    const properties = Object.fromEntries(
      fields.map((f) => {
        let fieldType: JSONSchema7['type'];
  
        if (f.type === 'select' || f.type === 'textarea') {
          fieldType = 'string';
        } else if (f.type === 'label') {
          fieldType = 'null';
        } else {
          fieldType = f.type;
        }
  
        return [
          generateFieldKey(f),
          {
            type: fieldType,
            title: f.label,
            enum: f.type === 'select' ? f.options ?? [] : undefined
          }
        ];
      })
    );
  
    return {
      title: formTitle,
      type: 'object',
      required: requiredFields,
      properties
    } as JSONSchema7;
  }, [fields, formTitle]);
  
  const generateUiSchema = useCallback(() => {
    const uiSchema: UiSchema = {
      'ui:order': fields.map((f) => generateFieldKey(f)),
      'ui:submitButtonOptions': { norender: true }
    };
  
    fields.forEach((f) => {
      const key = generateFieldKey(f);
      if (f.type === 'textarea') {
        uiSchema[key] = {
          'ui:widget': 'textarea',
          'ui:options': { rows: 4 }
        };
      }
  
      if (f.type === 'label') {
        uiSchema[key] = {
          'ui:field': 'label'
        };
      }
    });
  
    return uiSchema;
  }, [fields]);
  
  

  useEffect(() => {
    const schema = generateSchema();
    const uiSchema = generateUiSchema();
  
    onSchemaChange(schema, uiSchema);
  }, [fields, formTitle, onSchemaChange, generateSchema, generateUiSchema]);

  useEffect(() => {
    const errors: Record<string, string> = {};
    const labelCount: Record<string, number> = {};
  
    fields.filter((f) => f.type !== 'label').forEach((field) => {
      const label = field.label.trim();
  
      if (!label) {
        errors[field.id] = 'Label is required.';
      } else {
        labelCount[label] = (labelCount[label] || 0) + 1;
      }

      if (field.type === 'select') {
        if (!field.options || field.options.length === 0) {
          errors[field.id] = 'Dropdown must have at least one option.';
        }
      }


      if(label.length > MAX_FORM_LABEL_LENGTH) {
        errors[field.id] = `Label must be less than ${MAX_FORM_LABEL_LENGTH} characters`
      }
    });
  
    // Mark duplicates
    Object.entries(labelCount).forEach(([label, count]) => {
      if (count > 1) {
        fields
          .filter((f) => f.type !== 'label' && f.label.trim() === label)
          .forEach((f) => {
            errors[f.id] = 'Label must be unique.';
          });
      }
    });
  
    const formNameError = !formTitle.trim() ? 'Form Name is required.' : '';
  
    setLabelErrors(errors);
    setTitleError(formNameError);
    setIsValid(Object.keys(errors).length === 0 && !formNameError);
  }, [fields, formTitle]);

  const handleFieldChange = <K extends keyof Field>(index: number, key: K, value: Field[K]) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };
  
  const handleRemoveField = (index: number) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  const handleAddField = () => {
    setFields([...fields, createNewField()]);
  };

  const handleReset = () => {
    setFormTitle('Untitled Form');
    setFields([]);
  };

  const handleCancel= () => {
    navigate('/forms');
  };

  const handleSave = () => {
    const schema = generateSchema();
    const uiSchema = generateUiSchema();
    
    const formData = {
      schema,
      uiSchema
    };

    createForm({ title: formTitle, formData });
    handleCancel();
  };
  

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over?.id);
      const reordered = arrayMove(fields, oldIndex, newIndex);
      setFields(reordered);
    }
  };


  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h2" fontSize="1.6rem">
        Form Builder
      </Typography>
      <Box sx={{ p: 3 }} bgcolor="background.default">
        <Box mb={2}>
          <TextField
            label="Form Name"
            fullWidth
            size="small"
            value={formTitle}
            error={!!titleError}
            helperText={titleError}
            onChange={(e) => setFormTitle(e.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                backgroundColor: 'white',
              }
            }}
          />
        </Box>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <Box key={field.id} mb={2}>
                <SortableFieldRow
                  id={field.id}
                  index={index}
                  field={field}
                  error={labelErrors[field.id]}
                  onChange={handleFieldChange}
                  onDelete={handleRemoveField}
                />
              </Box>
            ))}
          </SortableContext>
        </DndContext>

        <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
          <Button variant="contained" onClick={handleAddField}>
          Add Field
          </Button>

          <Box display="flex" gap={2}>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={!isValid}>
            Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FormBuilder;
