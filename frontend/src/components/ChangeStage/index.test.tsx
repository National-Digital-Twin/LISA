import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
 
import { Incident } from 'common/Incident';
 
import { IncidentStage } from 'common/IncidentStage';
import ChangeStage from './index';
import { providersRender } from '../../test-utils';

// --- Mocks for child components ---
jest.mock('../Modal', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="modal">{children}</div>
));

jest.mock('../Form', () => ({
  FormField: ({
    field,
    error,
    onChange
  }: {
    field: { id: string; value: string };
    error: string;
    onChange: (id: string, value: string) => void;
  }) => (
    <>
      <input
        data-testid="form-field"
        value={field.value || ''}
        onChange={(e) => onChange(field.id, e.target.value)}
      />
      {error && <span data-testid="field-error">{error}</span>}
    </>
  ),
  FormFooter: ({
    onCancel,
    onSubmit,
    onShowValidationErrors
  }: {
    onCancel: () => void;
    onSubmit: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    onShowValidationErrors: (show: boolean) => void;
  }) => (
    <div>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button type="button" onClick={onSubmit}>
        Submit
      </button>
      <button type="button" onClick={() => onShowValidationErrors(true)}>
        Show Errors
      </button>
    </div>
  )
}));

jest.mock('../Stage', () => ({ label }: { label: string }) => (
  <div data-testid="stage">{label}</div>
));

jest.mock('../GridListItem', () => ({
  GridListItem: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="grid-list-item">
      <strong>{title}</strong>
      {children}
    </div>
  )
}));

const sampleIncident: Incident = {
  name: '',
  id: '1',
  stage: 'Monitoring' as IncidentStage,
  type: 'TerrorismInternational',
  startedAt: '',
  referrer: { name: '', organisation: '', telephone: '', email: '', supportRequested: 'No' }
};

describe('ChangeStage Component', () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem('MODAL_KEY', 'yes');
  });

  it('Does not render if incident is not provided', () => {
    providersRender(
      <ChangeStage
        incident={undefined as unknown as Incident}
        onChangeStage={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders the ChangeStage component correctly', () => {
    providersRender(
      <ChangeStage incident={sampleIncident} onChangeStage={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByText('Change incident stage')).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('stage')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const mockOnCancel = jest.fn();
    providersRender(
      <ChangeStage incident={sampleIncident} onChangeStage={jest.fn()} onCancel={mockOnCancel} />
    );
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls onChangeStage with the updated stage when submitted', () => {
    const mockOnChangeStage = jest.fn();
    providersRender(
      <ChangeStage
        incident={sampleIncident}
        onChangeStage={mockOnChangeStage}
        onCancel={jest.fn()}
      />
    );

    const stageInput = screen.getByTestId('form-field') as HTMLInputElement;
    fireEvent.change(stageInput, { target: { value: 'closed' } });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    expect(mockOnChangeStage).toHaveBeenCalledWith('closed');
  });

  it('calls onChangeStage even if the stage is unchanged (allows submission)', () => {
    const mockOnChangeStage = jest.fn();
    providersRender(
      <ChangeStage
        incident={sampleIncident}
        onChangeStage={mockOnChangeStage}
        onCancel={jest.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    expect(mockOnChangeStage).toHaveBeenCalledWith(sampleIncident.stage);
  });
});
