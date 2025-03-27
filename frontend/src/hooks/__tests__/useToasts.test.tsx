import React from 'react';
import { renderHook } from '@testing-library/react';
import { ToastContext } from '../../context/ToastContext';
import { useToast, useToastEntries } from '../useToasts';

describe('useToast', () => {
  let postToastMock: jest.Mock;

  // Create a custom provider that supplies the ToastContext.
  const createWrapper = () => {
    postToastMock = jest.fn();
    const contextValue = {
      postToast: postToastMock,
      toasts: [],
      removeToast: jest.fn()
    };
    return ({ children }: { children: React.ReactNode }) => (
      <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>
    );
  };

  it('returns the postToast function from the context', () => {
    const { result } = renderHook(() => useToast(), { wrapper: createWrapper() });

    // The hook should return the postToast function.
    expect(result.current).toBe(postToastMock);
  });
});

describe('useToastEntries', () => {
  let removeToastMock: jest.Mock;
  const sampleToasts = [
    { id: '1', message: 'Toast One' },
    { id: '2', message: 'Toast Two' }
  ];

  // Create a custom provider that supplies the ToastContext.
  const createWrapper = () => {
    removeToastMock = jest.fn();
    const contextValue = {
      postToast: jest.fn(),
      toasts: sampleToasts,
      removeToast: removeToastMock
    };
    return ({ children }: { children: React.ReactNode }) => (
      <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>
    );
  };

  it('returns the toasts array and removeToast function from the context', () => {
    const { result } = renderHook(() => useToastEntries(), { wrapper: createWrapper() });

    expect(result.current.toasts).toEqual(sampleToasts);
    expect(result.current.removeToast).toBe(removeToastMock);
  });
});
