// Global imports
import { Link } from 'react-router-dom';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { Format } from '../../utils';

const OFFLINE_MESSAGE = `This entry is only held offline.
It will be synchronised when you connect to a network.`;
interface Props {
  entry: LogEntry;
}

const EntryIndex = ({ entry }: Props) => {
  const prefix = entry.offline ? 'OFF' : '#';
  const className = 'item-index';
  return (
    <div className={className} title={entry.offline ? OFFLINE_MESSAGE : ''}>
      <Link to={`#${entry.id}`}>
        {prefix}
        {Format.entry.index(entry)}
      </Link>
    </div>
  );
};

export default EntryIndex;
