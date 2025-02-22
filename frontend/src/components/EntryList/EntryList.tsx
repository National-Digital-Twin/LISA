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
    // If one entry is offline and the other is not, the offline one comes first.
    if (a.offline && !b.offline) {
      return -1;
    }
    if (!a.offline && b.offline) {
      return 1;
    }
    // If both entries are offline, sort by sequence.
    if (a.offline && b.offline) {
      const seqA = Number(a.sequence);
      const seqB = Number(b.sequence);
      return seqA - seqB;
    }

    const aCreatedAt = a.createdAt ?? '';
    const bCreatedAt = b.createdAt ?? '';
    const aId = a.id ?? '';
    const bId = b.id ?? '';
    if (aCreatedAt === bCreatedAt) {
      if (sortAsc) {
        return aId.localeCompare(bId);
      }
      return bId.localeCompare(aId);
    }
    if (sortAsc) {
      return aCreatedAt.localeCompare(bCreatedAt);
    }
    return bCreatedAt.localeCompare(aCreatedAt);
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
