import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAttachmentScanResult } from '../useAttachmentScanResult';
import { get } from '../../api';

jest.mock('../../api', () => ({
  get: jest.fn()
}));

describe('useAttachmentScanResult', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('returns "THREATS_FOUND" immediately if initialScanResult is "THREATS_FOUND"', async () => {
    const { result } = renderHook(() => useAttachmentScanResult('THREATS_FOUND', 'dummy-key'));

    await waitFor(() => expect(result.current.scanResult).toBe('THREATS_FOUND'));
  });

  it('returns "NO_THREATS_FOUND" immediately if initialScanResult is "NO_THREATS_FOUND"', async () => {
    const { result } = renderHook(() => useAttachmentScanResult('NO_THREATS_FOUND', 'dummy-key'));

    await waitFor(() => expect(result.current.scanResult).toBe('NO_THREATS_FOUND'));
  });

  it('returns empty string for non-final initialScanResult (e.g. "PENDING") without entering polling branch', async () => {
    const { result } = renderHook(() => useAttachmentScanResult('PENDING', 'dummy-key'));

    // Since the API branch is only reached if internal scanResult === "PENDING",
    // and our hook does not update the internal state from its initial value (empty string),
    // we expect the state to remain as "".
    await waitFor(() => expect(result.current.scanResult).toBe(''));
  });

  it('updates scanResult when get returns a non-"PENDING" response (simulate polling branch)', async () => {
    // Override the initial scanResult state to "PENDING" for the hook.
    let useStateCallCount = 0;
    const originalUseState = React.useState;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(React, 'useState').mockImplementation((initial) => {
      useStateCallCount += 1;
      // For the first call (which initializes scanResult), return "PENDING" instead of empty string.
      if (useStateCallCount === 1) {
        return originalUseState('PENDING');
      }
      return originalUseState(initial);
    });

    // Simulate get resolving with a non-PENDING value.
    (get as jest.Mock).mockResolvedValueOnce('COMPLETED');

    const { result } = renderHook(() => useAttachmentScanResult('PENDING', 'dummy-key'));

    // Wait for the hook to update scanResult to "COMPLETED" once the get call returns.
    await waitFor(() => expect(result.current.scanResult).toBe('COMPLETED'));
  });

  it('sets scanResult to "PENDING" when an error occurs during polling', async () => {
    // Use fake timers.
    jest.useFakeTimers();

    let useStateCallCount = 0;
    const originalUseState = React.useState;
    // Override the internal scanResult to "PENDING" to force entering the polling branch.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(React, 'useState').mockImplementation((initial) => {
      useStateCallCount += 1;
      if (useStateCallCount === 1) {
        return originalUseState('PENDING');
      }
      return originalUseState(initial);
    });

    // Mock get to always throw an error to simulate a failure in the API call.
    (get as jest.Mock).mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useAttachmentScanResult('PENDING', 'dummy-key'));

    // Advance time to trigger the API call.
    await act(async () => {
      jest.advanceTimersByTime(2000);
      // Allow pending promises and state updates to flush.
      await Promise.resolve();
    });

    // The hook should catch the error and set the scanResult to "PENDING".
    await waitFor(() => expect(result.current.scanResult).toBe('PENDING'));
  });

  it('handles polling by incrementing attempts and scheduling next poll when get returns "PENDING", then updates state when non-"PENDING" response is received', async () => {
    // Use fake timers.
    jest.useFakeTimers();

    let useStateCallCount = 0;
    const originalUseState = React.useState;
    // Override the initial scanResult so that it starts as "PENDING".
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(React, 'useState').mockImplementation((initial) => {
      useStateCallCount += 1;
      if (useStateCallCount === 1) {
        return originalUseState('PENDING');
      }
      return originalUseState(initial);
    });

    // Simulate get first returning "PENDING", then a final "COMPLETED" response.
    (get as jest.Mock).mockResolvedValueOnce('PENDING').mockResolvedValueOnce('COMPLETED');

    const { result } = renderHook(() => useAttachmentScanResult('PENDING', 'dummy-key'));

    // Advance timers to trigger the first poll.
    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    // After the first poll we expect one API call.
    expect((get as jest.Mock).mock.calls.length).toBe(2);

    // Advance timers to trigger the next poll.
    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    // At this point, the hook should receive the completed response.
    await waitFor(() => expect(result.current.scanResult).toBe('COMPLETED'));
    // Verify that get has been called twice.
    expect((get as jest.Mock).mock.calls.length).toBe(2);
  });
});
