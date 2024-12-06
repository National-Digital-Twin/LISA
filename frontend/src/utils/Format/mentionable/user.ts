// Local imports
import { type Mentionable } from 'common/Mentionable';
import { type User } from 'common/User';
import { user as UserUtil } from '../user';

export function user(userObj: User): Mentionable {
  return { id: userObj.username, label: UserUtil(userObj), type: 'User' };
}
