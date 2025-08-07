// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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