import { type LogEntry } from 'common/LogEntry';
import { getMentionsOfType } from './utils';
import { FileNameMapping } from '../types';

export function reconcileFileMentions(entry: LogEntry, entryId: string, namesMap: FileNameMapping[]) {
  const { content } = entry;
  if (!content.json) {
    return;
  }

  const fileMentions = getMentionsOfType(entry, 'File');
  if (!fileMentions.length) {
    return;
  }

  fileMentions.forEach((mention) => {
    if (mention.id.startsWith('this::')) {
      const fileName = mention.id.split('::')[1];
      const mapping = namesMap.find((map) => map.originalname === fileName);
      content.json = content.json.replace(mention.id, `${entryId}::${mapping?.storedName || fileName}`);
    }
  });
}
