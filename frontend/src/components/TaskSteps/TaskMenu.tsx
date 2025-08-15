// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, Typography } from '@mui/material';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { type ValidationError } from '../../utils/types';

interface TaskMenuProps {
  validationErrors: ValidationError[];
  onNavigateToStep: (step: 'name' | 'assignee' | 'description' | 'location' | 'attachments' | 'sketch') => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function TaskMenu({ 
  validationErrors, 
  onNavigateToStep, 
  onCancel, 
  onSubmit,
  isSubmitting = false 
}: Readonly<TaskMenuProps>) {
  const getError = (fieldId: string) => validationErrors.find((e) => e.fieldId === fieldId);

  const menuItems = [
    {
      key: 'name' as const,
      icon: BadgeOutlinedIcon,
      label: 'Task name',
      fieldId: 'task_name',
      required: true
    },
    {
      key: 'assignee' as const,
      icon: AssignmentTurnedInOutlinedIcon,
      label: 'Assign to',
      fieldId: 'task_assignee',
      required: true
    },
    {
      key: 'description' as const,
      icon: NotesOutlinedIcon,
      label: 'Add task description',
      fieldId: 'task_description',
      required: true
    },
    {
      key: 'location' as const,
      icon: PlaceOutlinedIcon,
      label: 'Add location(s)',
      fieldId: null,
      required: false
    },
    {
      key: 'attachments' as const,
      icon: AttachFileOutlinedIcon,
      label: 'Add attachment(s)',
      fieldId: null,
      required: false
    },
    {
      key: 'sketch' as const,
      icon: DrawOutlinedIcon,
      label: 'Add sketch',
      fieldId: null,
      required: false
    }
  ];

  return (
    <>
      <Box bgcolor="background.default">
        <Box display="flex" flexDirection="column" gap={0}>
          {menuItems.map((item, index) => {
            const hasError = item.fieldId && getError(item.fieldId);
            const isLast = index === menuItems.length - 1;
            const IconComponent = item.icon;

            return (
              <Box
                key={item.key}
                onClick={() => onNavigateToStep(item.key)}
                sx={{ 
                  cursor: 'pointer', 
                  borderBottom: isLast ? 'none' : '1px solid', 
                  borderColor: 'divider', 
                  p: 2 
                }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <IconComponent color={!hasError ? 'primary' : 'error'} />
                  <Typography color={!hasError ? 'text.primary' : 'error'}>
                    {item.label}
                  </Typography>
                </Box>
                <ChevronRightIcon />
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box paddingX={2} display="flex" justifyContent="flex-end" alignItems="center" gap={2} py={2}>
        <Button onClick={onCancel} variant="outlined">
          CANCEL
        </Button>
        <Button
          variant="contained"
          startIcon={<ImportContactsOutlinedIcon />}
          onClick={onSubmit}
          disabled={validationErrors.length > 0 || isSubmitting}
          sx={{ minWidth: 100 }}
        >
          {isSubmitting ? 'SAVING...' : 'SAVE'}
        </Button>
      </Box>
    </>
  );
}
