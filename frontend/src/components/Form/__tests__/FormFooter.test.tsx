import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { providersRender } from '../../../test-utils';
import FormFooter from '../FormFooter';

const mockOnCancel = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnShowValidationErrors = jest.fn();

describe('FormFooter Tests', () => {
  it('Renders the component', () => {
    providersRender(
      <FormFooter
        validationErrors={[]}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
        onShowValidationErrors={mockOnShowValidationErrors}
      />
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  it('Renders the errors button, the button works', async () => {
    providersRender(
      <FormFooter
        validationErrors={[{ fieldId: 'Field Id', error: 'Field Error' }]}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
        onShowValidationErrors={mockOnShowValidationErrors}
      />
    );

    const button = screen.getByRole('button', { name: 'Show error' });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(mockOnShowValidationErrors).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Hide error' })).toBeInTheDocument();
  });
  it('handles onCancel', async () => {
    providersRender(
      <FormFooter
        validationErrors={[]}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
        onShowValidationErrors={mockOnShowValidationErrors}
      />
    );
    const button = screen.getByRole('button', { name: 'Cancel' });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
  it('Displays the correct submit label and handles onSumbit', async () => {
    providersRender(
      <FormFooter
        validationErrors={[]}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
        submitLabel="Test Submit Label"
        onShowValidationErrors={mockOnShowValidationErrors}
      />
    );
    const button = screen.getByRole('button', { name: 'Test Submit Label' });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
