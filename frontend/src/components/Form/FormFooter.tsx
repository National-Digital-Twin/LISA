// Global imports
import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

// Local imports
import { Icons } from '../../utils';
import { ValidationError } from '../../utils/types';

interface Props {
  validationErrors: Array<ValidationError>;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  onShowValidationErrors: (show: boolean) => void
}
export default function FormFooter({
  validationErrors,
  onCancel,
  onSubmit,
  submitLabel = 'Save',
  onShowValidationErrors
}: Readonly<Props>) {
  const [showingErrors, setShowingErrors] = useState<boolean>(false);

  const onCancelClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    onCancel();
  };

  const onToggleShowErrors = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    setShowingErrors((prev) => {
      onShowValidationErrors(!prev);
      return !prev;
    });
  };

  return (
    <div className="log-form-buttons">
      {validationErrors.length > 0 && (
        <div className="validation-errors">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link onClick={onToggleShowErrors} to="">
            {showingErrors ? 'Hide' : 'Show'}
          </Link>
          {' '}
          error
          {validationErrors.length > 1 && 's'}
        </div>
      )}
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link className="button cancel" onClick={onCancelClick} to="">Cancel</Link>
      <button
        type="button"
        className="button submit"
        onClick={onSubmit}
        title={validationErrors.length > 0 ? 'Correct the errors before you can save' : ''}
        disabled={validationErrors.length > 0}
      >
        <Icons.LogBook />
        {submitLabel}
      </button>
    </div>
  );
}
