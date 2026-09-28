// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Global imports
import { Record, Static, String, Array, Optional } from 'runtypes';

export const User = Record({
  username: String,
  displayName: String,
  email: Optional(String),
  groups: Optional(Array(String))
});

export interface UserListItem {
  username: string;
  displayName?: string;
  email? : string;
}

export type UserList = UserListItem[];

export type User = Static<typeof User>;
