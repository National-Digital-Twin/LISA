// Global imports
import { MouseEvent } from 'react';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type Mentionable } from 'common/Mentionable';
import bem from '../../utils/bem';
import EntryItem from './EntryItem';
import { getSortedEntriesWithDisplaySequence } from '../../utils/sortEntries';

type Props = {
  entries: Array<LogEntry>;
  sortAsc: boolean;
  onContentClick: (evt: MouseEvent<HTMLElement>) => void;
  onMentionClick: (mention: Mentionable) => void;
  // onAction: (id: string, action: RelationshipType) => void;
};

const EntryList = ({ entries, sortAsc, onContentClick, onMentionClick }: Props) => {
  const hasOffline = entries?.some((e) => e.offline === true);
  const classes = bem('log-entry-list', hasOffline ? ['has-offline'] : []);
  return (
    <div className={classes()} style={{ width: '100%' }}>
      {getSortedEntriesWithDisplaySequence(sortAsc, entries)?.map((entry) => (
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
