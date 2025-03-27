// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { extractLogEntryMentions } from './extractLogEntryMentions';
import { extractUserMentions } from './extractUserMentions';
import { parseLogEntryMentions } from './parseLogEntryMentions';
import { parseUserMentions } from './parseUserMentions';
import { reconcileFileMentions } from './reconcileFileMentions';

export const extract = {
  logEntry: extractLogEntryMentions,
  user: extractUserMentions
};

export const parse = {
  logEntry: parseLogEntryMentions,
  user: parseUserMentions
};

export const reconcile = {
  file: reconcileFileMentions
};
