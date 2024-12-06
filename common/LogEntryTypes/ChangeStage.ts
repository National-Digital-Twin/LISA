// Local imports
import { type LogEntryTypesDictItem } from './types';

export const ChangeStage: LogEntryTypesDictItem = {
  label: 'Stage change',
  colour: 'yellow',
  fields: () => [],
  noContent: true,
  stage: true,
  unselectable: () => true
};
