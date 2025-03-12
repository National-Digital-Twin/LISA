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

  if (userObj) {
    const name = userObj.displayName ?? userObj.username;
    return pretty.initials(name);
  }
  return '';
};
