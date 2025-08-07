// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Record, Static, String, Array } from 'runtypes';

export const User = Record({
  username: String,
  displayName: String,
  email: String,
  groups: Array(String)
});

export interface UserListItem {
  username: string;
  displayName?: string;
}

export type UserList = UserListItem[];

export type User = Static<typeof User>;
