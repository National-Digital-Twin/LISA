// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Object, type Static, String, Boolean, Literal, Union } from 'runtypes';

// Local imports
import { nonFuture } from './constraints';
import { IncidentStage } from './IncidentStage';
import { IncidentType } from './IncidentType';
import { User } from './User';

export const ReferralWithSupport = Object({
  name: String,
  organisation: String,
  telephone: String,
  email: String,
  supportRequested: Literal('Yes'),
  supportDescription: String
});

export const ReferralWithoutSupport = Object({
  name: String,
  organisation: String,
  telephone: String,
  email: String,
  supportRequested: Literal('No'),
  supportDescription: String.optional()
});

export const Referrer = Union(ReferralWithSupport, ReferralWithoutSupport);

export const Incident = Object({
  id: String.optional(), // System-generated

  // Can only be set at the point of creation:
  type: IncidentType, // User-selected
  startedAt: String.withConstraint(nonFuture), // User-entered, ISO-format
  createdAt: String.optional(), // system generated
  reportedBy: User.optional(), // user id
  referrer: Referrer,

  // Can be changed after creation.
  // These may end up being set on a LogEntry to keep the Incident unchanged.
  name: String,
  stage: IncidentStage, // User-selected

  // This allows for determining if the Incident has been synced to the server during
  // offline operation.
  offline: Boolean.optional()
});

export type Incident = Static<typeof Incident>;

export type Referrer = Static<typeof Referrer>;
