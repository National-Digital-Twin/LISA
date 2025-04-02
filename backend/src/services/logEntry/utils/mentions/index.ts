// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { extractLogEntryMentionsFromLogContent } from './extractLogEntryMentions';
import { extractUserMentionsFromLogContent } from './extractUserMentions';
import { parseLogEntryMentions } from './parseLogEntryMentions';
import { parseUserMentions } from './parseUserMentions';
import { reconcileFileMentionsFromLogContent } from './reconcileFileMentions';

export const extractLogContent = {
  logEntry: extractLogEntryMentionsFromLogContent,
  user: extractUserMentionsFromLogContent
};

export const parse = {
  logEntry: parseLogEntryMentions,
  user: parseUserMentions
};

export const reconcileLogFiles = {
  file: reconcileFileMentionsFromLogContent
};
