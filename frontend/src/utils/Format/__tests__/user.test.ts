import type { User } from 'common/User';
import { user, userInitials } from '../user';

// Mock the 'pretty' module which is imported by user.ts.
jest.mock('../pretty', () => ({
  pretty: {
    name: (username: string) => `Formatted: ${username}`,
    initials: (name: string) =>
      name
        .split(' ')
        .map((n) => n.charAt(0).toUpperCase())
        .join('')
  }
}));

describe('user', () => {
  it('should return an empty string when no user object is provided', () => {
    expect(user()).toBe('');
  });

  it('should return displayName when provided on the user object', () => {
    const userObj = { username: 'jdoe', displayName: 'John Doe', email: 'test@test.com', groups: [] };
    expect(user(userObj)).toBe('John Doe');
  });

  it('should return a formatted username when displayName is not provided', () => {
    const userObj = { username: 'jdoe' } as User;
    expect(user(userObj)).toBe('Formatted: jdoe');
  });
});

describe('userInitials', () => {
  it('should return an empty string when no user object is provided', () => {
    expect(userInitials()).toBe('');
  });

  it('should return initials based on displayName when provided', () => {
    const userObj = { username: 'jdoe', displayName: 'John Doe', email: 'test@test.com', groups: [] };
    // Using the mocked implementation which returns the initials by taking the first letters of each word.
    // "John Doe" should give "JD".
    expect(userInitials(userObj)).toBe('JD');
  });

  it('should return initials based on username when displayName is not provided', () => {
    const userObj = { username: 'jane doe' } as User;
    // With the mocked implementation, "jane doe" becomes "JD".
    expect(userInitials(userObj)).toBe('JD');
  });
});
