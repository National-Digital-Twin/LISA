import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type FieldType } from 'common/FieldType';
import { useNavigate } from 'react-router-dom';
import FormField from '../FormField';
import { providersRender } from '../../../test-utils';

const mockOnChange = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn()
  };
});

describe('FormField Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders the component and displays a field label.', () => {
    const { rerender } = providersRender(
      <FormField
        field={{ id: 'Test Id', type: 'Input', label: 'Test Label' }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    rerender(
      <FormField
        field={{ id: 'Test Id', type: 'Input', label: 'Updated Label' }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Updated Label')).toBeInTheDocument();
  });

  it('Displays the optional tag', () => {
    providersRender(
      <FormField
        field={{ id: 'Test Id', type: 'Input', label: 'Test Label', optional: true }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('Displays the horizontal span', () => {
    providersRender(
      <FormField
        field={{ id: 'Test Id', type: 'Input', label: 'Test Label', className: 'horizontalYN' }}
        onChange={mockOnChange}
      />
    );
    const span = screen.getByTestId('horizontal-span');
    expect(span).toHaveClass('h-sep');
  });

  it('Displays the correct input, id and value for field type Input and calls onChange', async () => {
    providersRender(
      <FormField
        field={{
          id: 'Test Id',
          type: 'Input',
          label: 'Test Label'
        }}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Test Label');
    await userEvent.type(input, 'Test Value');
    expect(mockOnChange).toHaveBeenCalled();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('id', 'Test Id');
    expect(input).toHaveValue('Test Value');
  });

  it('Displays the correct input, id and value for field type TextArea', () => {
    providersRender(
      <FormField
        field={{
          id: 'Test Id',
          type: 'TextArea',
          label: 'Test Label',
          value: 'Test Value'
        }}
        onChange={mockOnChange}
      />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('id', 'Test Id');
    expect(textarea).toHaveValue('Test Value');
  });

  it('Displays the react-select for field type Selects', async () => {
    const selectTypes = ['Select', 'SelectLogEntry', 'YesNo']; // Add SelectMulti
    const { rerender } = providersRender(
      <FormField
        field={{
          id: 'Test Id',
          type: 'Select',
          label: 'Test Label'
        }}
        onChange={mockOnChange}
      />
    );
    await Promise.all(
      selectTypes.map(async (type) => {
        rerender(
          <FormField
            field={{
              id: 'Test Id',
              type: type as Partial<FieldType>,
              label: 'Test Label'
            }}
            onChange={mockOnChange}
          />
        );
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        // Optionally, add a waitFor if the element might take a bit to render:
        // await waitFor(() => expect(screen.getByRole('combobox')).toBeInTheDocument());
      })
    );
  });

  it('Displays the correct value and inputs for type DateTime and mocks update of values.', async () => {
    providersRender(
      <FormField
        field={{
          id: 'Test Id',
          type: 'DateTime',
          label: 'Test Label'
        }}
        onChange={mockOnChange}
      />
    );
    const dateContainer = screen.getByTestId('date-input');
    const dateInput = within(dateContainer).getByDisplayValue('');
    const timeContainer = screen.getByTestId('time-input');
    const timeInput = within(timeContainer).getByDisplayValue('');
    expect(dateInput).toBeInTheDocument();
    expect(timeInput).toBeInTheDocument();
    fireEvent.change(dateInput, { target: { value: '2025-02-13' } });
    fireEvent.change(timeInput, { target: { value: '15:30' } });
    expect(dateInput).toHaveValue('2025-02-13');
    expect(timeInput).toHaveValue('15:30');
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  it('Displays the location field for field type Location and navigates to location', async () => {
    const mockNavigate = jest.fn();
    jest.mocked(useNavigate).mockReturnValue(mockNavigate);
    providersRender(
      <FormField
        field={{
          id: 'Test Id',
          type: 'Location',
          label: 'Test Label'
        }}
        onChange={mockOnChange}
      />
    );
    const location = screen.getByTestId('location-field');
    await userEvent.click(screen.getByRole('button', { name: 'Set' }));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('#location');
    expect(location).toBeInTheDocument();
  });

  it('Displays the label field for field type Label', () => {
    providersRender(
      <FormField
        field={{
          id: 'Test Id',
          type: 'Label',
          label: 'Test Label',
          hint: 'Test hint'
        }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Test hint')).toBeInTheDocument();
  });

  it('Displays an error', () => {
    providersRender(
      <FormField
        field={{
          id: 'Test Id',
          type: 'Input',
          label: 'Test Label'
        }}
        error={{ fieldId: 'Test Id', error: 'Test error' }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});
