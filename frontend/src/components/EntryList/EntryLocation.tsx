// Global imports
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { Format } from '../../utils';

interface Props {
  entry: LogEntry;
}

export default function EntryLocation({ entry }: Readonly<Props>) {
  const link = useMemo(() => Format.entry.locationLink(entry), [entry]);

  if (!entry.location) {
    return null;
  }

  return (
    <ul className="log-entry-location">
      <li>Location:</li>
      <li>
        {link ? (
          <Link to={link}>{Format.entry.location(entry)}</Link>
        ) : Format.entry.location(entry)}
      </li>
    </ul>
  );
}
