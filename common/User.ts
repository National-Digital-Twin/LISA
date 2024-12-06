// Global imports
import { Optional, Record, Static, String } from 'runtypes';

export const User = Record({
  username: String,
  displayName: Optional(String)
});

export interface UserListItem {
  username: string,
  displayName?: string,
}

export type UserList = UserListItem[];

// eslint-disable-next-line no-redeclare
export type User = Static<typeof User>;
