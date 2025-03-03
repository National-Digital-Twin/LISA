// Global imports
import { MouseEvent, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type Mentionable } from 'common/Mentionable';
import bem from '../../utils/bem';
import EntryIndex from './EntryIndex';
import Attachments from './Attachments';
import Details from './Details';
import EntryLocation from './EntryLocation';
import Mentions from './Mentions';
import Meta from './Meta';

interface Props {
  entry: LogEntry;
  entries: Array<LogEntry>;
  disableScrollTo?: boolean;
  onContentClick: (evt: MouseEvent<HTMLElement>) => void;
  onMentionClick: (mention: Mentionable) => void;
}
const EntryItem = ({
  entry,
  entries,
  disableScrollTo = false,
  onContentClick,
  onMentionClick
}: Props) => {
  const { hash } = useLocation();
  const divRef = useRef<HTMLDivElement>(null);
  const { id, offline } = entry;
  const modifiers = useMemo(() => {
    const arr = [offline ? 'offline' : ''];
    if (hash === `#${id}`) {
      arr.push('highlighted');
    }
    return arr;
  }, [hash, id, offline]);
  const classes = bem('item', modifiers);

  useEffect(() => {
    if (disableScrollTo) return;
    if (divRef.current && hash === `#${id}`) {
      divRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [hash, id, disableScrollTo]);

  return (
    <div id={id} ref={divRef} className={classes()}>
      <div className={classes('header')}>
        <EntryIndex entry={entry} />
        <Meta entry={entry} />
      </div>
      <Details entry={entry} onContentClick={onContentClick} />
      <EntryLocation entry={entry} />
      <Mentions entry={entry} entries={entries} onMentionClick={onMentionClick} />
      <Attachments entry={entry} />
    </div>
  );
};

export default EntryItem;
