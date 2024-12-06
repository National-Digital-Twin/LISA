// Global imports
import { Link } from 'react-router-dom';

// Local imports
import { type LogEntry } from 'common/LogEntry';

interface Props {
  entry: LogEntry;
  value: string | string[] | undefined;
}
export function SelectionValue({ entry, value }: Props) {
  if (!value) {
    return null;
  }
  return (
    <Link to={`/logbook/${entry.incidentId}#${value}`}>
      View linked
    </Link>
  );
}
