// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.


import React, { useState } from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import EmergencyIcon from '@mui/icons-material/Emergency';
import EmergencyOutlinedIcon from '@mui/icons-material/EmergencyOutlined';
import {
  Grid2 as Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Box
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Field } from './types';

interface SortableFieldRowProps {
  id: string;
  field: Field;
  index: number;
  error?: string;
  onChange:  <K extends keyof Field>(index: number, key: K, value: Field[K]) => void;
  onDelete: (index: number) => void;
}

const SortableFieldRow: React.FC<SortableFieldRowProps> = ({
  id,
  field,
  index,
  error = '',
  onChange,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [tempOptions, setTempOptions] = useState<string[]>(field.options ?? []);

  const openDialog = () => {
    setTempOptions(field.options ?? []);
    setDialogOpen(true);
  };

  const handleAddOption = () => {
    if (newOption.trim() && !tempOptions.includes(newOption)) {
      setTempOptions([...tempOptions, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleDeleteOption = (opt: string) => {
    setTempOptions(tempOptions.filter((o) => o !== opt));
  };

  const saveOptions = () => {
    onChange(index, 'options', tempOptions);
    setDialogOpen(false);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems="flex-start"
        ref={setNodeRef}
        style={style}
      >
        <Grid sx={{ flexGrow: 1 }}>
          <TextField
            label="Label"
            fullWidth
            size="small"
            value={field.label}
            error={!!error}
            helperText={error}
            onChange={(e) => onChange(index, 'label', e.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                backgroundColor: 'white',
              }
            }}
          />
        </Grid>

        <Grid>
          <Select
            fullWidth
            size="small"
            value={field.type}
            onChange={(e) => onChange(index, 'type', e.target.value as Field['type'])}
            sx={{
              '& .MuiInputBase-input': {
                backgroundColor: 'white',
              }
            }}
          >
            <MenuItem value="string">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="boolean">Checkbox</MenuItem>
            <MenuItem value="select">Dropdown</MenuItem>
          </Select>
        </Grid>

        {field.type === 'select' && (
          <Grid>
            <IconButton onClick={openDialog}>
              <ListIcon/>
            </IconButton>
          </Grid>
        )}
        {field.type !== 'boolean' && (
          <Grid>
            <IconButton
              onClick={() => onChange(index, 'required', !field.required)}
              title={field.required ? 'Mark as optional' : 'Mark as required'}
            >
              {field.required ? <EmergencyIcon color="error" /> : <EmergencyOutlinedIcon />}
            </IconButton>
          </Grid>
        )}
        <Grid>
          {/* SH Revert this if possible */}
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <IconButton {...attributes} {...listeners}>
            <DragIndicatorIcon />
          </IconButton>
        </Grid>
        <Grid>
          <IconButton color="error" onClick={() => onDelete(index)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* Option Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>Edit Options</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={1} my={2}>
            <TextField
              label="New Option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              fullWidth
              size="small"
            />
            <Button onClick={handleAddOption}>Add</Button>
          </Box>

          <List dense>
            {tempOptions.map((opt) => (
              <ListItem
                key={opt}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDeleteOption(opt)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={opt} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveOptions} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SortableFieldRow;
