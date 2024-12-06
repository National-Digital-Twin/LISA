// Global imports
import { MouseEvent } from 'react';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type Mentionable } from 'common/Mentionable';
import bem from '../../utils/bem';
import EntryItem from './EntryItem';

type Props = {
  entries: Array<LogEntry> | undefined;
  sortAsc: boolean;
  onContentClick: (evt: MouseEvent<HTMLElement>) => void;
  onMentionClick: (mention: Mentionable) => void;
  // onAction: (id: string, action: RelationshipType) => void;
};

const EntryList = ({
  entries,
  sortAsc,
  onContentClick,
  onMentionClick
}: Props) => {
  const sortEntries = (a: LogEntry, b: LogEntry): number => {
    const aDateTime = a.dateTime ?? '';
    const bDateTime = b.dateTime ?? '';
    const aId = a.id ?? '';
    const bId = b.id ?? '';
    if (aDateTime === bDateTime) {
      if (sortAsc) {
        return aId.localeCompare(bId);
      }
      return bId.localeCompare(aId);
    }
    if (sortAsc) {
      return aDateTime.localeCompare(bDateTime);
    }
    return bDateTime.localeCompare(aDateTime);
  };

  const hasOffline = entries?.some((e) => e.offline === true);
  const classes = bem('log-entry-list', hasOffline ? ['has-offline'] : []);
  return (
    <div className={classes()}>
      {entries?.sort(sortEntries)?.map((entry) => (
        <EntryItem
          key={entry.id}
          entry={entry}
          entries={entries}
          onContentClick={onContentClick}
          onMentionClick={onMentionClick}
        />
      ))}
    </div>
  );
};

export default EntryList;
