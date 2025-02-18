import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { providersRender } from '../../../test-utils';
import FormGroup from '../FormGroup';

const mockOnFieldChange = jest.fn();

describe('FormGroup Tests', () => {
  it('Renders the component.', () => {
    providersRender(
      <FormGroup
        group={{
          id: 'Group Id',
          label: 'Group Label',
          description: 'Group Description',
          fieldIds: ['Field Id']
        }}
        fields={[{ id: 'Field Id', type: 'Input', label: 'Field Label' }]}
        entry={{
          incidentId: 'Incident Id',
          dateTime: '',
          type: 'Action',
          content: { json: '', text: '' }
        }}
        validationErrors={[]}
        onFieldChange={mockOnFieldChange}
      />
    );
    expect(screen.getByText('Group Label')).toBeInTheDocument();
    expect(screen.getByText('Group Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Field Label')).toBeInTheDocument();
  });
  it("Doesn't render a group label", () => {
    providersRender(
      <FormGroup
        group={{
          id: 'Group Id',
          fieldIds: ['Field Id']
        }}
        fields={[{ id: 'Field Id', type: 'Input', label: 'Field Label' }]}
        entry={{
          incidentId: 'Incident Id',
          dateTime: '',
          type: 'Action',
          content: { json: '', text: '' }
        }}
        validationErrors={[]}
        onFieldChange={mockOnFieldChange}
      />
    );
    expect(screen.queryByText('Group Label')).toBeNull();
  });
  it('handles onFieldChange', async () => {
    providersRender(
      <FormGroup
        group={{
          id: 'Group Id',
          label: 'Group Label',
          fieldIds: ['Field Id']
        }}
        fields={[{ id: 'Field Id', type: 'Input', label: 'Field Label' }]}
        entry={{
          incidentId: 'Incident Id',
          dateTime: '',
          type: 'Action',
          content: { json: '', text: '' }
        }}
        validationErrors={[]}
        onFieldChange={mockOnFieldChange}
      />
    );
    const input = screen.getByLabelText('Field Label');
    await userEvent.type(input, 'Test Value');
    expect(mockOnFieldChange).toHaveBeenCalled();
  });
  it('handles onClickLabel', async () => {
    providersRender(
      <FormGroup
        group={{
          id: 'Group Id',
          label: 'Group Label',

          fieldIds: ['Field Id']
        }}
        fields={[{ id: 'Field Id', type: 'Input', label: 'Field Label' }]}
        entry={{
          incidentId: 'Incident Id',
          dateTime: '',
          type: 'Action',
          content: { json: '', text: '' }
        }}
        validationErrors={[]}
        onFieldChange={mockOnFieldChange}
      />
    );
    const link = screen.getByRole('link', { name: 'Group Label' });
    await userEvent.click(link);
    const listItem = screen.getAllByRole('listitem');
    expect(listItem[0]).toHaveClass('form-group form-group--open');
    await userEvent.click(link);
    expect(listItem[0]).toHaveClass('form-group');
  });
});
