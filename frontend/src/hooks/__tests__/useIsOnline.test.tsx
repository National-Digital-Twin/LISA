import { renderHook, act } from '@testing-library/react';
import { onlineManager } from '@tanstack/react-query';
import { useIsOnline } from '../useIsOnline';

// Mock onlineManager
jest.mock('@tanstack/react-query', () => {
  const listeners: ((online: boolean) => void)[] = [];
  let isOnline = true;

  return {
    onlineManager: {
      isOnline: () => isOnline,
      subscribe: (cb: (online: boolean) => void) => {
        listeners.push(cb);
        cb(isOnline);
        return () => {
          const index = listeners.indexOf(cb);
          if (index > -1) listeners.splice(index, 1);
        };
      },
      simulateOnlineChange: (online: boolean) => {
        isOnline = online;
        listeners.forEach((cb) => cb(online));
      },
    },
  };
});

type MockedOnlineManager = typeof onlineManager & {
    simulateOnlineChange: (online: boolean) => void;
  };
  
const mockedOnlineManager = onlineManager as MockedOnlineManager;

describe('useIsOnline', () => {
  afterEach(() => {
    mockedOnlineManager.simulateOnlineChange(true);
  });

  it('returns the current online state on mount', () => {
    mockedOnlineManager.simulateOnlineChange(true);
    const { result } = renderHook(() => useIsOnline());
    expect(result.current).toBe(true);
  });

  it('updates when online state changes to offline', () => {
    const { result } = renderHook(() => useIsOnline());

    act(() => {
      mockedOnlineManager.simulateOnlineChange(false);
    });

    expect(result.current).toBe(false);
  });

  it('updates when online state changes from false to true', () => {
    mockedOnlineManager.simulateOnlineChange(false);
    const { result } = renderHook(() => useIsOnline());

    act(() => {
      mockedOnlineManager.simulateOnlineChange(true);
    });

    expect(result.current).toBe(true);
  });

  it('cleans up on unmount', () => {
    const unsubscribeMock = jest.fn();

    const spySubscribe = jest
      .spyOn(onlineManager, 'subscribe')
      .mockImplementation((cb) => {
        cb(true);
        return unsubscribeMock;
      });

    const { unmount } = renderHook(() => useIsOnline());
    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
    spySubscribe.mockRestore();
  });
});
