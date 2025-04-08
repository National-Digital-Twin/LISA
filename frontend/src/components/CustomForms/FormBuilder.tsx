/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField
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
import SortableFieldRow from "./SortableFieldRow"
import { generateFieldKey } from './utils';
import { Field } from './types';

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

  useEffect(() => {
    const schema = {
      title: formTitle,
      type: 'object',
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
  
    const uiSchema = {
      'ui:order': fields.map((f) => generateFieldKey(f.label))
    };
  
    onSchemaChange(schema, uiSchema);
  }, [fields, formTitle, onSchemaChange]);
  
  

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
    <Paper sx={{ p: 3 }}>
      <Box mb={2}>
        <TextField
          label="Form Name"
          fullWidth
          size="small"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
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
                onChange={handleFieldChange}
                onDelete={handleRemoveField}
              />
            </Box>
          ))}
        </SortableContext>
      </DndContext>

      <Box mt={3}>
        <Button variant="contained" onClick={handleAddField}>
          Add Field
        </Button>
      </Box>
    </Paper>
  );
};

export default FormBuilder;
