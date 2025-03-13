// Global imports
import { Link } from 'react-router-dom';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { location } from '../location';
import { locationLink } from '../locationLink';

type Props = {
  entry: LogEntry;
};
export function LocationValue({ entry }: Readonly<Props>) {
  const href = locationLink(entry);
  const text = location(entry);
  if (href) {
    return <Link to={href}>{text}</Link>;
  }
  return text;
}
