import { renderHook, act } from '@testing-library/react';
import { onlineManager } from '@tanstack/react-query';
import { useIsOnline } from '../useIsOnline';

jest.useFakeTimers();

let isOnlineState = true;
const listeners: ((online: boolean) => void)[] = [];

beforeAll(() => {
  onlineManager.isOnline = () => isOnlineState;

  onlineManager.subscribe = (cb: (online: boolean) => void) => {
    listeners.push(cb);
    cb(isOnlineState);
    return () => {
      const index = listeners.indexOf(cb);
      if (index > -1) listeners.splice(index, 1);
    };
  };

  onlineManager.setOnline = (value: boolean) => {
    isOnlineState = value;
    act(() => {
      listeners.forEach((cb) => cb(value));
    });
  };
});

describe('useIsOnline', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    isOnlineState = true;
    listeners.length = 0;

    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('returns true if onlineManager is online', () => {
    const { result } = renderHook(() => useIsOnline());
    expect(result.current).toBe(true);
  });

  it('sets false if ping fails', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useIsOnline());

    await act(async () => {
      jest.runOnlyPendingTimers();
      await Promise.resolve();
    });

    expect(result.current).toBe(false);
  });

  it('sets true if ping succeeds', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    isOnlineState = false;

    const { result } = renderHook(() => useIsOnline());

    await act(async () => {
      jest.runOnlyPendingTimers();
      await Promise.resolve();
    });

    expect(result.current).toBe(true);
  });

  it('sets false immediately if navigator.onLine is false', async () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });

    const { result } = renderHook(() => useIsOnline());

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toBe(false);
  });

  it('cleans up interval and unsubscribes on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const unsubscribeMock = jest.fn();

    // Override onlineManager.subscribe just for this test
    const originalSubscribe = onlineManager.subscribe;
    onlineManager.subscribe = () => unsubscribeMock;

    const { unmount } = renderHook(() => useIsOnline());
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(unsubscribeMock).toHaveBeenCalled();

    // Restore original
    onlineManager.subscribe = originalSubscribe;
  });
});
