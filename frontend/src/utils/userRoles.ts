// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { User } from "common/User";

export function isAdmin(userObj?: User): boolean {
  if (userObj?.groups) {
    return userObj.groups?.includes('lisa_admin');
  }
  return false;
}