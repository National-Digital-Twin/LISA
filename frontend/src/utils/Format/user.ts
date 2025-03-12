// Local imports
import { type User } from 'common/User';
import { pretty } from './pretty';

export function user(userObj?: User): string {
  if (userObj) {
    return userObj.displayName ?? pretty.name(userObj.username);
  }
  return '';
}

export const userInitials = (userObj?: User): string => {
  const formatInitials = (value: string) => {
    const words = value.trim().split(/[\s.]+/);
    return words.map((word) => word[0].toUpperCase()).join('');
  };

  if (userObj) {
    const name = userObj.displayName ?? userObj.username;
    return formatInitials(name);
  }
  return '';
};
