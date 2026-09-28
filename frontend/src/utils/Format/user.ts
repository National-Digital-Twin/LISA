// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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