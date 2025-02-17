import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { providersRender } from '../../../test-utils';
import FormHelpButton from '../FormHelpButton';

describe('FormHelpButton Tests', () => {
  it('Renders the component', () => {
    providersRender(
      <FormHelpButton field={{ id: 'Field Id', type: 'Input', hint: 'Field Hint' }} />
    );
    expect(screen.getByRole('button', { name: '?' })).toBeInTheDocument();
  });
  it('handles internal onClick', async () => {
    providersRender(
      <FormHelpButton
        field={{ id: 'Field Id', label: 'Field Label', type: 'Input', hint: 'Field Hint' }}
      />
    );
    const button = screen.getByRole('button', { name: '?' });
    await userEvent.click(button);
    expect(screen.getByText('Field Label')).toBeInTheDocument();
  });
  it('handles clicking outside of button', async () => {
    providersRender(
      <FormHelpButton
        field={{ id: 'Field Id', label: 'Field Label', type: 'Input', hint: 'Field Hint' }}
      />
    );
    const button = screen.getByRole('button', { name: '?' });
    await userEvent.click(button);
    expect(screen.getByText('Field Label')).toBeInTheDocument();

    await userEvent.pointer({ keys: '[MouseLeft]', target: document.body });
    expect(screen.queryByText('Field Label')).toBeNull();
  });
});
