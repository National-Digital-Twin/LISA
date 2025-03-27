// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Mentionable } from 'common/Mentionable';
import { type User } from 'common/User';
import { user as UserUtil } from '../user';

export function user(userObj: User): Mentionable {
  return { id: userObj.username, label: UserUtil(userObj), type: 'User' };
}
