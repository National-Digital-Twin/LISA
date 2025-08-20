// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { render, act } from '@testing-library/react';
import { onlineManager } from '@tanstack/react-query';
import OnlineProvider from '../OnlineProvider';

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

describe('OnlineProvider', () => {
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

  it('starts polling on mount', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    render(
      <OnlineProvider>
        <div>Test Child</div>
      </OnlineProvider>
    );

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 2500);
  });

  it('pings immediately on mount', () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(
      <OnlineProvider>
        <div>Test Child</div>
      </OnlineProvider>
    );

    expect(fetch).toHaveBeenCalledWith('/api/ping', {
      method: 'HEAD',
      cache: 'no-store'
    });
  });

  it('sets offline when ping fails', async () => {
    const setOnlineSpy = jest.spyOn(onlineManager, 'setOnline');
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(
      <OnlineProvider>
        <div>Test Child</div>
      </OnlineProvider>
    );

    await act(async () => {
      jest.runOnlyPendingTimers();
      await Promise.resolve();
    });

    expect(setOnlineSpy).toHaveBeenCalledWith(false);
  });

  it('sets online when ping succeeds', async () => {
    const setOnlineSpy = jest.spyOn(onlineManager, 'setOnline');
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(
      <OnlineProvider>
        <div>Test Child</div>
      </OnlineProvider>
    );

    await act(async () => {
      jest.runOnlyPendingTimers();
      await Promise.resolve();
    });

    expect(setOnlineSpy).toHaveBeenCalledWith(true);
  });

  it('sets offline when navigator.onLine is false', async () => {
    const setOnlineSpy = jest.spyOn(onlineManager, 'setOnline');
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });

    render(
      <OnlineProvider>
        <div>Test Child</div>
      </OnlineProvider>
    );

    // Wait for the immediate ping call
    await act(async () => {
      await Promise.resolve();
    });

    expect(setOnlineSpy).toHaveBeenCalledWith(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('cleans up interval and unsubscribes on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const unsubscribeMock = jest.fn();

    // Override onlineManager.subscribe just for this test
    const originalSubscribe = onlineManager.subscribe;
    onlineManager.subscribe = () => unsubscribeMock;

    const { unmount } = render(
      <OnlineProvider>
        <div>Test Child</div>
      </OnlineProvider>
    );

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(unsubscribeMock).toHaveBeenCalled();

    // Restore original
    onlineManager.subscribe = originalSubscribe;
  });

  it('continues polling at intervals', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(
      <OnlineProvider>
        <div>Test Child</div>
      </OnlineProvider>
    );

    // Initial call
    expect(fetch).toHaveBeenCalledTimes(1);

    // First interval
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetch).toHaveBeenCalledTimes(2);

    // Second interval
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetch).toHaveBeenCalledTimes(3);
  });
});
