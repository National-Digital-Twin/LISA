import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAttachmentScanResult } from '../useAttachmentScanResult';
import { get } from '../../api';

jest.mock('../../api', () => ({
  get: jest.fn()
}));

/**
 * Overrides the internal scanResult state for the useAttachmentScanResult hook.
 * The hook normally initializes its state based on the first call to React.useState.
 * For tests that require the scanResult to be 'PENDING' internally, this helper forces that.
 *
 * @param overrideValue - The value to be used for the initial state.
 */
const overrideInitialScanResult = (overrideValue: string) => {
  let callCount = 0;
  const originalUseState = React.useState;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  jest.spyOn(React, 'useState').mockImplementation((initial) => {
    callCount += 1;
    // Use the override value on the first call.
    if (callCount === 1) {
      return originalUseState(overrideValue);
    }
    return originalUseState(initial);
  });
};

/**
 * Renders the useAttachmentScanResult hook with the provided initial scan result.
 *
 * @param initialScan - The initial scan result passed to the hook.
 * @returns The result of renderHook.
 */
const renderUseAttachmentScanResult = (initialScan: string) =>
  renderHook(() => useAttachmentScanResult(initialScan, 'dummy-key'));

describe('useAttachmentScanResult', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Immediate ScanResult', () => {
    // For final statuses, the hook should return the value immediately,
    // while a non-final value (such as "PENDING") results in an empty string.
    test.each([
      ['THREATS_FOUND', 'THREATS_FOUND'],
      ['NO_THREATS_FOUND', 'NO_THREATS_FOUND'],
      ['PENDING', '']
    ])('returns "%s" immediately when initialScanResult is "%s"', async (initialScan, expected) => {
      const { result } = renderUseAttachmentScanResult(initialScan);
      await waitFor(() => expect(result.current.scanResult).toBe(expected));
    });
  });

  describe('Polling Behavior', () => {
    it('updates scanResult when get returns a non-"PENDING" response', async () => {
      overrideInitialScanResult('PENDING');
      (get as jest.Mock).mockResolvedValueOnce('COMPLETED');

      const { result } = renderHook(() => useAttachmentScanResult('PENDING', 'dummy-key'));
      await waitFor(() => expect(result.current.scanResult).toBe('COMPLETED'));
    });

    it('sets scanResult to "PENDING" when an error occurs during polling', async () => {
      jest.useFakeTimers();
      overrideInitialScanResult('PENDING');
      (get as jest.Mock).mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useAttachmentScanResult('PENDING', 'dummy-key'));

      await act(async () => {
        jest.advanceTimersByTime(2000);
        // Allow state updates to flush.
        await Promise.resolve();
      });

      await waitFor(() => expect(result.current.scanResult).toBe('PENDING'));
    });

    it('handles polling by incrementing attempts and scheduling next polls until non-"PENDING" response is received', async () => {
      jest.useFakeTimers();
      overrideInitialScanResult('PENDING');

      // Simulate get returning "PENDING" twice then "COMPLETED"
      (get as jest.Mock)
        .mockResolvedValueOnce('PENDING')
        .mockResolvedValueOnce('PENDING')
        .mockResolvedValueOnce('COMPLETED');

      const { result } = renderHook(() => useAttachmentScanResult('PENDING', 'dummy-key'));

      // Simulate time passing to trigger multiple polling attempts
      await act(async () => {
        jest.advanceTimersByTime(2000);
        await Promise.resolve();
      });
      await act(async () => {
        jest.advanceTimersByTime(2000);
        await Promise.resolve();
      });

      await waitFor(() => expect(result.current.scanResult).toBe('COMPLETED'));
    });
  });
});
