import { screen, fireEvent } from '@testing-library/react';
import Search from '../../Filter/Search';
import { providersRender } from '../../../test-utils';

describe('Search Component', () => {
  const initialText = 'initial search';
  let onChangeMock: jest.Mock;

  beforeEach(() => {
    onChangeMock = jest.fn();
  });

  it('renders input with provided initial value', () => {
    providersRender(<Search searchText={initialText} onChange={onChangeMock} />);
    const inputElement = screen.getByPlaceholderText('Search...');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue(initialText);
  });

  it('updates the input value on change', () => {
    providersRender(<Search searchText={initialText} onChange={onChangeMock} />);
    const inputElement = screen.getByPlaceholderText('Search...');
    fireEvent.change(inputElement, { target: { value: 'updated value' } });
    expect(inputElement).toHaveValue('updated value');
  });

  it('invokes onChange callback when search icon is clicked', () => {
    providersRender(<Search searchText={initialText} onChange={onChangeMock} />);
    const inputElement = screen.getByPlaceholderText('Search...');
    fireEvent.change(inputElement, { target: { value: 'click search' } });

    const linkElement = screen.getByRole('link');
    fireEvent.click(linkElement);

    expect(onChangeMock).toHaveBeenCalledWith('click search');
  });

  it('calls onChange callback when native "search" event is triggered on input', () => {
    providersRender(<Search searchText={initialText} onChange={onChangeMock} />);
    const inputElement = screen.getByPlaceholderText('Search...');
    fireEvent.change(inputElement, { target: { value: 'native event' } });

    const searchEvent = new Event('search', { bubbles: true });
    Object.defineProperty(searchEvent, 'target', {
      value: inputElement,
      writable: false
    });

    fireEvent(inputElement, searchEvent);

    expect(onChangeMock).toHaveBeenCalledWith('native event');
  });
});
