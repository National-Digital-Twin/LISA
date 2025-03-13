// Local imports
import { date } from './date';
import { entry } from './entry';
import { fileSize } from './fileSize';
import { incident } from './incident';
import { isoDate } from './isoDate';
import { lexical } from './lexical';
import { mentionable } from './mentionable';
import { pretty } from './pretty';
import { time } from './time';
import { timestamp } from './timestamp';
import { user, userInitials } from './user';
import { dateMobile } from './dateMobile';

export const VIEW_LOCATION = 'View location';

const Format = {
  date,
  dateMobile,
  entry,
  fileSize,
  incident,
  isoDate,
  lexical,
  mentionable,
  pretty,
  time,
  timestamp,
  user,
  userInitials
};

export default Format;
