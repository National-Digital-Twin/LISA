import { screen } from '@testing-library/react';
import { providersRender } from '../../../test-utils';
import FormFields from '../FormFields';

const mockOnChange = jest.fn();

describe('FormFields Tests', () => {
  it('Renders the component.', () => {
    providersRender(
      <FormFields
        fields={[
          { id: 'Field Id', type: 'Input', label: 'Field Label' },
          { id: 'Field Id 1', type: 'Input', label: 'Field Label 1' }
        ]}
        groups={[]}
        onFieldChange={mockOnChange}
        entry={{
          incidentId: 'Incident Id',
          dateTime: '',
          type: 'action',
          content: { json: '', text: '' }
        }}
        validationErrors={[]}
        showValidationErrors={false}
      />
    );
    expect(screen.getByLabelText('Field Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Field Label 1')).toBeInTheDocument();
  });
  it("Doesn't render if fields array is empty.", () => {
    providersRender(
      <FormFields
        fields={[]}
        groups={[]}
        onFieldChange={mockOnChange}
        entry={{
          incidentId: 'Incident Id',
          dateTime: '',
          type: 'action',
          content: { json: '', text: '' }
        }}
        validationErrors={[]}
        showValidationErrors={false}
      />
    );
    expect(screen.queryByText('Test Label')).toBeNull();
  });
  it('Renders a group of multiple fields.', () => {
    providersRender(
      <FormFields
        fields={[
          { id: 'Field Id', type: 'Input', label: 'Field Label' },
          { id: 'Field Id 1', type: 'Input', label: 'Field Label 1' }
        ]}
        groups={[{ id: 'Group Id', label: 'Group Label', fieldIds: ['Field Id', 'Field Id 1'] }]}
        onFieldChange={mockOnChange}
        entry={{
          incidentId: 'Incident Id',
          dateTime: '',
          type: 'action',
          content: { json: '', text: '' }
        }}
        validationErrors={[]}
        showValidationErrors={false}
      />
    );
    expect(screen.getByText('Group Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Field Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Field Label 1')).toBeInTheDocument();
  });
});
