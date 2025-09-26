import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigation } from '../useNavigation';

const mockUseLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockUseLocation()
}));

describe('useNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return navigation items', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' });

    const { result } = renderHook(() => useNavigation(), {
      wrapper: MemoryRouter
    });

    expect(result.current.navigationItems).toEqual([
      { to: '/', label: 'Home' },
      { to: '/incidents', label: 'Incidents' },
      { to: '/tasks', label: 'Tasks' },
      { to: '/forms', label: 'Form Templates' }
    ]);
  });

  it('should correctly identify active route', () => {
    mockUseLocation.mockReturnValue({ pathname: '/incidents' });

    const { result } = renderHook(() => useNavigation(), {
      wrapper: MemoryRouter
    });

    expect(result.current.isActive('/')).toBe(false);
    expect(result.current.isActive('/incidents')).toBe(true);
    expect(result.current.isActive('/tasks')).toBe(false);
    expect(result.current.isActive('/forms')).toBe(false);
  });

  it('should handle link click', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' });

    const { result } = renderHook(() => useNavigation(), {
      wrapper: MemoryRouter
    });

    const mockScrollTo = jest.fn();
    Object.defineProperty(document.documentElement, 'scrollTo', {
      value: mockScrollTo,
      writable: true
    });

    result.current.handleLink();

    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should handle different active routes', () => {
    const testCases = [
      { pathname: '/', expectedActive: '/', expectedInactive: ['/incidents', '/tasks', '/forms'] },
      {
        pathname: '/incidents',
        expectedActive: '/incidents',
        expectedInactive: ['/', '/tasks', '/forms']
      },
      {
        pathname: '/tasks',
        expectedActive: '/tasks',
        expectedInactive: ['/', '/incidents', '/forms']
      },
      {
        pathname: '/forms',
        expectedActive: '/forms',
        expectedInactive: ['/', '/incidents', '/tasks']
      }
    ];

    testCases.forEach(({ pathname, expectedActive, expectedInactive }) => {
      mockUseLocation.mockReturnValue({ pathname });

      const { result } = renderHook(() => useNavigation(), {
        wrapper: MemoryRouter
      });

      expect(result.current.isActive(expectedActive)).toBe(true);
      expectedInactive.forEach((path) => {
        expect(result.current.isActive(path)).toBe(false);
      });
    });
  });
});
