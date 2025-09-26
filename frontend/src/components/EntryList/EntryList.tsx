// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { MouseEvent } from 'react';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type Mentionable } from 'common/Mentionable';
import bem from '../../utils/bem';
import EntryItem from './EntryItem';

type Props = {
  entries: Array<LogEntry>;
  onContentClick: (evt: MouseEvent<HTMLElement>) => void;
  onMentionClick: (mention: Mentionable) => void;
  // onAction: (id: string, action: RelationshipType) => void;
};

const EntryList = ({ entries, onContentClick, onMentionClick }: Props) => {
  const hasOffline = entries?.some((e) => e.offline === true);
  const classes = bem('log-entry-list', hasOffline ? ['has-offline'] : []);
  return (
    <div className={classes()} style={{ width: '100%' }}>
      {entries.map((entry) => (
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
