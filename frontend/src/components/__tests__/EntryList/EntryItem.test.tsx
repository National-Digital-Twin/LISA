// EntryItem.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import EntryItem from '../../EntryList/EntryItem';

jest.mock('../../EntryList/Meta', () => () => <div data-testid="meta" />);
jest.mock('../../EntryList/Details', () => () => <div data-testid="details" />);
jest.mock('../../EntryList/EntryLocation', () => () => <div data-testid="entry-location" />);
jest.mock('../../EntryList/Mentions', () => () => <div data-testid="mentions" />);
jest.mock('../../EntryList/Attachments', () => () => <div data-testid="attachments" />);

const mockUseResponsive = jest.fn(() => ({ isMobile: true, isBelowMd: true }));
jest.mock('../../../hooks/useResponsiveHook', () => ({
  useResponsive: () => mockUseResponsive(),
}));

let mockHash = '';
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ hash: mockHash }),
}));

const postToastMock = jest.fn();
jest.mock('../../../hooks', () => ({
  useToast: () => postToastMock,
}));

import { ToastContext } from '../../../context/ToastContext'
import { LogEntry } from 'common/LogEntry';
const removeToastMock = jest.fn();

beforeAll(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(undefined),
    },
  });
});

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(globalThis, 'setTimeout');
  jest.spyOn(globalThis, 'clearTimeout');
  (navigator.clipboard.writeText as jest.Mock).mockClear();
  postToastMock.mockClear();
  removeToastMock.mockClear();
  mockHash = '';
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ToastContext.Provider
      value={{
        toasts: [],
        postToast: postToastMock,
        removeToast: removeToastMock,
      }}
    >
      {ui}
    </ToastContext.Provider>
  );
}

const baseEntry = {
  id: 'abc',
  sequence: '123',
  author: { username: 'alice' },
  offline: false,
} as LogEntry;

const defaultProps = {
  entry: baseEntry,
  entries: [],
  onContentClick: jest.fn(),
  onMentionClick: jest.fn(),
};

test('long-press on mobile copies sequence, shows success toast, and auto-dismisses', async () => {
  mockHash = '';
  mockUseResponsive.mockReturnValue({ isMobile: true, isBelowMd: true });

  renderWithProviders(<EntryItem {...defaultProps} />);

  const button = screen.getByRole('button', { name: 'Copy #123' });

  fireEvent.touchStart(button);

  await act(async () => {
    jest.advanceTimersByTime(560);
  });

  await act(async () => {
    fireEvent.touchEnd(button);
    await Promise.resolve();
  });

  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('123');

  expect(postToastMock).toHaveBeenCalledTimes(1);
  const toastArg = postToastMock.mock.calls[0][0];
  expect(toastArg.type).toBe('Success');
  expect(toastArg.id).toBe('copied_123');

  await act(async () => {
    jest.advanceTimersByTime(1200);
  });
  expect(removeToastMock).toHaveBeenCalledWith('copied_123');

  expect(globalThis.clearTimeout).toHaveBeenCalled();
});


test('offline entry: long-press does nothing (no copy, no toast)', async () => {
  mockUseResponsive.mockReturnValue({ isMobile: true, isBelowMd: true });

  renderWithProviders(
    <EntryItem
      {...defaultProps}
      entry={{ ...baseEntry, offline: true }}
    />
  );

  const button = screen.getByRole('button', { name: 'Submitting' });

  fireEvent.touchStart(button);

  await act(async () => {
    jest.advanceTimersByTime(1000);
  });

  expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  expect(postToastMock).not.toHaveBeenCalled();
  fireEvent.touchEnd(button);
});

test('cancelling before threshold prevents copy/toast', async () => {
  mockUseResponsive.mockReturnValue({ isMobile: true, isBelowMd: true });

  renderWithProviders(<EntryItem {...defaultProps} />);

  const button = screen.getByRole('button', { name: 'Copy #123' });

  fireEvent.touchStart(button);

  await act(async () => {
    jest.advanceTimersByTime(300);
  });
  fireEvent.touchEnd(button);

  await act(async () => {
    jest.advanceTimersByTime(1000);
  });

  expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  expect(postToastMock).not.toHaveBeenCalled();
});

test('scrolls into view when hash matches and disableScrollTo is false', () => {
  mockHash = '#abc';
  mockUseResponsive.mockReturnValue({ isMobile: true, isBelowMd: true });

  const scrollSpy = jest.fn();
  Element.prototype.scrollIntoView = scrollSpy;

  renderWithProviders(<EntryItem {...defaultProps} />);

  expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
});

test('does not render mobile-only copy target when not mobile', () => {
  mockUseResponsive.mockReturnValue({ isMobile: false, isBelowMd: false });

  renderWithProviders(<EntryItem {...defaultProps} />);

  expect(screen.queryByRole('button')).toBeNull();
});
