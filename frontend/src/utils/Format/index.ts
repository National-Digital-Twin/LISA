// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { date } from './date';
import { entry } from './entry';
import { fileSize } from './fileSize';
import { incident } from './incident';
import { isoDate } from './isoDate';
import { lexical } from './lexical';
import { mentionable } from './mentionable';
import { pretty } from './pretty';
import { time, relativeTime } from './time';
import { timestamp } from './timestamp';
import { user, userInitials } from './user';
import { dateAndTimeMobile } from './dateAndTimeMobile';

export const VIEW_LOCATION = 'View location';

const Format = {
  date,
  dateAndTimeMobile,
  entry,
  fileSize,
  incident,
  isoDate,
  lexical,
  mentionable,
  pretty,
  time,
  relativeTime,
  timestamp,
  user,
  userInitials
};

export default Format;
