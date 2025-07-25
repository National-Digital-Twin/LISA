// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// eslint-disable-next-line import/no-extraneous-dependencies
import { Incident as BaseIncident } from 'common/Incident';

export type OfflineIncident = Omit<BaseIncident, 'reportedBy'> & {
    expiresAt?: string;
    offline: true;
  };