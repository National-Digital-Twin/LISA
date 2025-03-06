// Global imports
import { MouseEvent, useState } from 'react';
import { Box, Button } from '@mui/material';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

// Local imports
import { ValidationError } from '../../utils/types';

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

  const onCancelClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    onCancel();
  };

  const onToggleShowErrors = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setShowingErrors((prev) => {
      onShowValidationErrors(!prev);
      return !prev;
    });
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" gap={1}>
      {validationErrors.length > 0 && (
        <Button
          type="button"
          variant="text"
          disableRipple
          disableTouchRipple
          onClick={onToggleShowErrors}
          sx={{ color: 'text.primary' }}
        >
          {showingErrors ? 'Hide' : 'Show'}
          {validationErrors.length > 1 ? ' errors' : ' error'}
        </Button>
      )}
      <Button onClick={onCancelClick} variant="outlined" disableRipple disableTouchRipple>
        Cancel
      </Button>
      <Button
        variant="contained"
        startIcon={<ImportContactsIcon />}
        disableRipple
        disableTouchRipple
        onClick={onSubmit}
        disabled={validationErrors.length > 0}
        loading={loading}
      >
        {submitLabel}
      </Button>
    </Box>
  );
}
