// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import React from 'react';
import { renderHook } from '@testing-library/react';
import { useIsOnline } from '../useIsOnline';
import { OnlineContext } from '../../context/OnlineContext';

describe('useIsOnline', () => {
  it('throws error when used outside OnlineProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useIsOnline());
    }).toThrow('useIsOnline must be used within OnlineProvider');

    consoleSpy.mockRestore();
  });

  it('returns true when context indicates online', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OnlineContext.Provider value={{ isOnline: true }}>
        {children}
      </OnlineContext.Provider>
    );

    const { result } = renderHook(() => useIsOnline(), { wrapper });
    expect(result.current).toBe(true);
  });

  it('returns false when context indicates offline', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OnlineContext.Provider value={{ isOnline: false }}>
        {children}
      </OnlineContext.Provider>
    );

    const { result } = renderHook(() => useIsOnline(), { wrapper });
    expect(result.current).toBe(false);
  });
});
