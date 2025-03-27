import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call the passed function after the specified delay', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('testArg1', 'testArg2');
    // Since debounce delays the call, the function should not have been called immediately.
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward time to trigger the delayed function call.
    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledWith('testArg1', 'testArg2');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should call the function only once if invoked multiple times within the delay period', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    // Call the debounced function several times in quick succession.
    debouncedFn('first');
    jest.advanceTimersByTime(100);
    debouncedFn('second');
    jest.advanceTimersByTime(100);
    debouncedFn('third');

    // At this point, the delay has not yet fully passed after the most recent call.
    jest.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();

    // Advance time past the debounce delay so the last call takes effect.
    jest.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('should reset the delay if called again before the delay elapses', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 400);

    debouncedFn('firstCall');
    jest.advanceTimersByTime(200);
    debouncedFn('secondCall');
    // The timer should reset, so advancing time 200ms more should not trigger the call.
    jest.advanceTimersByTime(200);
    expect(mockFn).not.toHaveBeenCalled();

    // Now the full delay passes after the last call.
    jest.advanceTimersByTime(400);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('secondCall');
  });
});
