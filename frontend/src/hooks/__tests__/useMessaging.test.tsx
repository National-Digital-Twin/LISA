import { ReactNode, act } from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { type MessagingTopicType } from 'common/Messaging';
import useMessaging from '../useMessaging';
import { type MessagingContextType } from '../../utils/types';
import { MessagingContext } from '../../context/MessagingContext';

describe('useMessaging', () => {
  let subscribeMock: jest.Mock;
  let unsubscribeMock: jest.Mock;

  let capturedCallback: (() => void) | undefined;

  // Create a simple provider that passes our mock functions via context.
  const wrapper = ({ children }: { children: ReactNode }) => {
    const contextValue: MessagingContextType = {
      subscribe: jest.fn((_topic: MessagingTopicType, _subject: string, callback: () => void) => {
        // Capture the callback so we can simulate an incoming message later.
        capturedCallback = callback;
      }),
      unsubscribe: jest.fn()
    };

    // Assign our mocks for later verification.
    subscribeMock = contextValue.subscribe as jest.Mock;
    unsubscribeMock = contextValue.unsubscribe as jest.Mock;

    return <MessagingContext.Provider value={contextValue}>{children}</MessagingContext.Provider>;
  };

  beforeEach(() => {
    // Reset mocks and captured callback before each test.
    subscribeMock?.mockReset();
    unsubscribeMock?.mockReset();
    capturedCallback = undefined;
  });

  it('does not subscribe/unsubscribe when subject is not provided', () => {
    // Render the hook with no subject.
    const topic = 'test-topic' as MessagingTopicType;
    const { unmount } = renderHook(() => useMessaging(topic), { wrapper });

    expect(subscribeMock).not.toHaveBeenCalled();

    // Unmounting should not call unsubscribe either.
    unmount();
    expect(unsubscribeMock).not.toHaveBeenCalled();
  });

  it('subscribes on mount and unsubscribes on unmount when subject is provided', () => {
    const topic = 'test-topic' as MessagingTopicType;
    const subject = 'test-subject';

    const { unmount } = renderHook(() => useMessaging(topic, subject), { wrapper });

    // Verify that subscribe is called with the provided topic, subject, and a callback function.
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    expect(subscribeMock).toHaveBeenCalledWith(topic, subject, expect.any(Function));

    const subscribedCallback = subscribeMock.mock.calls[0][2];
    // Unmount the hook to trigger the cleanup effect.
    unmount();
    // Verify that unsubscribe is called with the same parameters and callback.
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    expect(unsubscribeMock).toHaveBeenCalledWith(topic, subject, subscribedCallback);
  });

  it('updates hasMessage state when the received callback is invoked', async () => {
    const topic = 'test-topic' as MessagingTopicType;
    const subject = 'test-subject';

    // Render the hook and capture its result so we can inspect the state.
    const { result, unmount } = renderHook(() => useMessaging(topic, subject), { wrapper });

    let [initialHasMessage, resetHasMessage] = result.current;

    // Initially, since no message has been received, it should return false.
    expect(initialHasMessage).toBe(false);

    // Simulate receiving a message using act.
    act(() => {
      capturedCallback!();
    });

    // Wait for the state update using waitFor.
    await waitFor(() => {
      const [hasMessageAfterCallback] = result.current;
      expect(hasMessageAfterCallback).toBe(true);
    });

    // After state update, check reset function
    const [, reset] = result.current;
    expect(typeof reset).toBe('function');

    // Call reset function
    act(() => {
      reset();
    });

    // Wait for state to reset back to false
    await waitFor(() => {
      const [hasMessageAfterReset] = result.current;
      expect(hasMessageAfterReset).toBe(false);
    });

    unmount();
  });
});
