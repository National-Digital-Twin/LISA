// Global imports
import { MouseEvent, useState } from 'react';
import { Box, Button } from '@mui/material';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

// Local imports
import { ValidationError } from '../../utils/types';
import { useResponsive } from '../../hooks/useResponsiveHook';

interface Props {
  validationErrors: Array<ValidationError>;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  onShowValidationErrors: (show: boolean) => void;
  loading?: boolean;
}
export default function FormFooter({
  validationErrors,
  onCancel,
  onSubmit,
  submitLabel = 'Save',
  onShowValidationErrors,
  loading = false
}: Readonly<Props>) {
  const [showingErrors, setShowingErrors] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const onCancelClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    onCancel();
  };

  const handleSubmitClick = () => {
    setIsSubmitted(true);
    onSubmit();
  };

  const onToggleShowErrors = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setShowingErrors((prev) => {
      onShowValidationErrors(!prev);
      return !prev;
    });
  };

  const { isMobile } = useResponsive();

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="center"
      gap={1}
      width="100%"
    >
      {validationErrors.length > 0 && (
        <Button
          type="button"
          size={isMobile ? 'small' : 'medium'}
          variant="text"
          onClick={onToggleShowErrors}
          sx={{ color: 'text.primary' }}
        >
          {showingErrors ? 'Hide' : 'Show'}
          {validationErrors.length > 1 ? ' errors' : ' error'}
        </Button>
      )}
      <Button onClick={onCancelClick} variant="outlined">
        Cancel
      </Button>
      <Button
        variant="contained"
        startIcon={<ImportContactsIcon />}
        onClick={handleSubmitClick}
        disabled={validationErrors.length > 0 || isSubmitted}
        loading={loading}
      >
        {submitLabel}
      </Button>
    </Box>
  );
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
