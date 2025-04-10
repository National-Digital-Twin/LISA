/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';
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

  function generateSchema() {
    const requiredFields = fields
      .filter((f) => f.required)
      .map((f) => generateFieldKey(f.label));

    return {
      title: formTitle,
      type: 'object',
      required: requiredFields,
      properties: Object.fromEntries(
        fields.map((f) => [
          generateFieldKey(f.label),
          {
            type: f.type === 'select' ? 'string' : f.type,
            title: f.label,
            enum: f.type === 'select' ? f.options ?? [] : undefined
          }
        ])
      )
    } as JSONSchema7;
  }

  useEffect(() => {
    const schema = generateSchema();
  
    const uiSchema = {
      'ui:order': fields.map((f) => generateFieldKey(f.label)),
      // force hiding of submit button that RJSF displays by default - this should be handled by FormBuilder
      "ui:submitButtonOptions": { norender: true }
    };
  
    onSchemaChange(schema, uiSchema);
  }, [fields, formTitle, onSchemaChange]);

  useEffect(() => {
    const errors: Record<string, string> = {};
    const labelCount: Record<string, number> = {};
  
    fields.forEach((field) => {
      const label = field.label.trim();
  
      if (!label) {
        errors[field.id] = 'Label is required.';
      } else {
        labelCount[label] = (labelCount[label] || 0) + 1;
      }
    });
  
    // Mark duplicates
    Object.entries(labelCount).forEach(([label, count]) => {
      if (count > 1) {
        fields
          .filter((f) => f.label.trim() === label)
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

    createForm({ title: formTitle, formData: schema });
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
