import { type LogEntry } from 'common/LogEntry';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { MentionableType, type Mentionable } from 'common/Mentionable';

export function getMentions(entry: LogEntry): Mentionable[] {
  const type = LogEntryTypes[entry.type];
  if (type.noContent || !entry.content.json) {
    return [];
  }

  const mentions: Mentionable[] = [];
  function findMentions(node: { type?: string; mentionType?: MentionableType; mentionName?: string, text: string, children?: Array<unknown>}) {
    if (node.type === 'mention') {
      mentions.push({
        id: node.mentionName,
        label: node.text,
        type: node.mentionType
      });
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(findMentions);
    }
  }
  const parsedContent = JSON.parse(entry.content.json);
  findMentions(parsedContent.root);
  return mentions;
}

export function getMentionsOfType(entry: LogEntry, type: MentionableType): Mentionable[] {
  const allMentions = getMentions(entry);
  return allMentions.filter((m) => m.type === type);
}
