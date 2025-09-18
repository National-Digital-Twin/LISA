// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { render, screen, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type Notification } from 'common/Notification';
import NotificationProvider from '../NotificationProvider';
import { useNotificationContext } from '../../hooks/useNotificationContext';
import { get } from '../../api';

jest.mock('../../api');
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: { current: { username: 'testuser' } } })
}));
jest.mock('../../hooks/useMessaging', () => ({
  __esModule: true,
  default: () => [false, jest.fn()]
}));

jest.useFakeTimers();

const mockNotifications: Notification[] = [
  {
    id: '1',
    recipient: 'testuser',
    read: false,
    seen: false,
    dateTime: '2025-01-01T00:00:00Z',
    incidentTitle: 'Test Incident',
    entry: {
      id: 'entry1',
      incidentId: 'incident1',
      author: { username: 'author1', displayName: 'Author 1' }
    }
  }
];

function TestComponent() {
  const { addPendingChange, isPolling } = useNotificationContext();

  return (
    <div>
      <span data-testid="polling-status">{isPolling ? 'polling' : 'idle'}</span>
      <button data-testid="add-change" onClick={() => addPendingChange('test', () => true)} />
      <button
        data-testid="add-failing-change"
        onClick={() => addPendingChange('test-fail', () => false)}
      />
    </div>
  );
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>{children}</NotificationProvider>
    </QueryClientProvider>
  );
}

describe('NotificationProvider', () => {
  beforeEach(() => {
    (get as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('starts polling when pending changes are added', async () => {
    (get as jest.Mock).mockResolvedValue(mockNotifications);

    render(<TestComponent />, { wrapper: createWrapper() });

    expect(screen.getByTestId('polling-status')).toHaveTextContent('idle');

    act(() => {
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByTestId('add-change').click();
    });

    expect(screen.getByTestId('polling-status')).toHaveTextContent('polling');
    expect(get).toHaveBeenCalledWith('/notifications');
  });

  it('stops polling when conditions are met', async () => {
    (get as jest.Mock).mockResolvedValue(mockNotifications);

    render(<TestComponent />, { wrapper: createWrapper() });

    act(() => {
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByTestId('add-change').click();
    });

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId('polling-status')).toHaveTextContent('idle');
    });
  });

  it('continues polling when conditions are not met', async () => {
    (get as jest.Mock).mockResolvedValue([]);

    render(<TestComponent />, { wrapper: createWrapper() });

    act(() => {
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByTestId('add-failing-change').click();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(get).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(get).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('polling-status')).toHaveTextContent('polling');
  });

  it('stops polling after max attempts', async () => {
    (get as jest.Mock).mockResolvedValue([]);

    render(<TestComponent />, { wrapper: createWrapper() });

    act(() => {
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByTestId('add-failing-change').click();
    });

    await act(async () => {
      await Promise.resolve();
    });

    // Run through all attempts
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        jest.advanceTimersByTime(5000);
        await Promise.resolve();
      });
    }

    await waitFor(() => {
      expect(screen.getByTestId('polling-status')).toHaveTextContent('idle');
    });

    expect(get).toHaveBeenCalledTimes(11); // Initial + 10 retries
  });

  it('resets attempt counter when new changes are added during polling', async () => {
    (get as jest.Mock).mockResolvedValue([]);

    render(<TestComponent />, { wrapper: createWrapper() });

    // Start polling
    act(() => {
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByTestId('add-failing-change').click();
    });

    await act(async () => {
      await Promise.resolve();
    });

    // Advance to attempt 5
    for (let i = 0; i < 4; i++) {
      await act(async () => {
        jest.advanceTimersByTime(5000);
        await Promise.resolve();
      });
    }

    expect(get).toHaveBeenCalledTimes(5);

    // Add new change - should reset attempts
    act(() => {
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByTestId('add-failing-change').click();
    });

    // Should continue for full 10 more attempts
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        jest.advanceTimersByTime(5000);
        await Promise.resolve();
      });
    }

    expect(get).toHaveBeenCalledTimes(15); // 5 + 10 (reset happens during polling)
  });

  it('handles API errors with retry logic', async () => {
    (get as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<TestComponent />, { wrapper: createWrapper() });

    act(() => {
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByTestId('add-change').click();
    });

    await act(async () => {
      await Promise.resolve();
    });

    // Should retry 3 times
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        jest.advanceTimersByTime(5000);
        await Promise.resolve();
      });
    }

    await waitFor(() => {
      expect(screen.getByTestId('polling-status')).toHaveTextContent('idle');
    });

    expect(get).toHaveBeenCalledTimes(4); // Initial + 3 retries
  });

  it('cleans up timeouts on unmount', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    (get as jest.Mock).mockResolvedValue([]);

    const { unmount } = render(<TestComponent />, { wrapper: createWrapper() });

    act(() => {
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByTestId('add-failing-change').click();
    });

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
