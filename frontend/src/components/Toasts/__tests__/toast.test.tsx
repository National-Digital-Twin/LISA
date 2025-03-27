import { render, screen, fireEvent, act } from '@testing-library/react';
import Toast from '../Toast';
import { ToastEntry } from '../../../utils/types';

describe('Toast component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const baseToast: ToastEntry = {
    id: 'test-toast',
    type: 'Success',
    content: 'Test Toast Message',
    isDismissable: false
  };

  it('calls onRemove after timeout for non-dismissable toast', () => {
    const removeMock = jest.fn();
    render(<Toast toast={baseToast} onRemove={removeMock} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith(baseToast.id);
  });

  it('calls onRemove after timeout for dismissible toast', () => {
    const dismissibleToast = { ...baseToast, isDismissable: true };
    const removeMock = jest.fn();
    render(<Toast toast={dismissibleToast} onRemove={removeMock} />);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith(dismissibleToast.id);
  });

  it('pauses auto removal on mouse enter and resumes on mouse leave for dismissible toast', () => {
    const dismissibleToast = { ...baseToast, isDismissable: true };
    const removeMock = jest.fn();
    render(<Toast toast={dismissibleToast} onRemove={removeMock} />);

    const alertContainer = screen.getByRole('alertdialog');

    fireEvent.mouseEnter(alertContainer);
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(removeMock).not.toHaveBeenCalled();

    fireEvent.mouseLeave(alertContainer);
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith(dismissibleToast.id);
  });

  it('immediately calls onRemove when clicking on content and close button for dismissible toast', () => {
    const dismissibleToast = { ...baseToast, isDismissable: true };
    const removeMock = jest.fn();
    render(<Toast toast={dismissibleToast} onRemove={removeMock} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    fireEvent.click(buttons[0]);
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith(dismissibleToast.id);

    removeMock.mockClear();

    fireEvent.click(buttons[1]);
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith(dismissibleToast.id);
  });

  it('clears timer on unmount so that onRemove is not called after unmount', () => {
    const removeMock = jest.fn();
    const { unmount } = render(<Toast toast={baseToast} onRemove={removeMock} />);

    unmount();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(removeMock).not.toHaveBeenCalled();
  });

  it('does not alter auto-removal behavior when isDismissable is not provided', () => {
    const toastWithoutDismissable = {
      id: 'toast-no-dismiss',
      type: 'Success',
      content: 'No dismiss property'
    } as unknown as Omit<ToastEntry, 'isDismissable'>;

    const removeMock = jest.fn();
    render(<Toast toast={toastWithoutDismissable} onRemove={removeMock} />);

    const alertContainer = screen.getByRole('alertdialog');

    fireEvent.mouseEnter(alertContainer);
    fireEvent.mouseLeave(alertContainer);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith(toastWithoutDismissable.id);
  });
});
