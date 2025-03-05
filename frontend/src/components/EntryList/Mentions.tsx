// Global imports
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type Mentionable } from 'common/Mentionable';
import { Format } from '../../utils';
import { getSortedEntriesWithDisplaySequence } from '../../utils/sortEntries';

function getIds(items?: Array<Partial<Mentionable>>): Array<string> {
  return items?.map((i) => i.id ?? '')?.filter((i) => !!i) ?? [];
}
function enhance(ids: Array<string>, entries: Array<LogEntry>): Array<Mentionable> {
  return ids
    .map((id) => {
      const mentionedEntry = getSortedEntriesWithDisplaySequence(false, entries).find((e) => e.id === id);
      if (mentionedEntry) {
        return Format.mentionable.entry(mentionedEntry);
      }
      return undefined;
    })
    .filter((m) => !!m);
}

interface Props {
  entry: LogEntry;
  entries: Array<LogEntry>;
  onMentionClick: (mention: Mentionable) => void;
}
const Mentions = ({ entry, entries, onMentionClick }: Props) => {
  const mentions = useMemo(
    () => enhance(getIds(entry.mentionsLogEntries), entries),
    [entry, entries]
  );
  const mentionedBy = useMemo(
    () => enhance(getIds(entry.mentionedByLogEntries), entries),
    [entry, entries]
  );

  if (mentions.length === 0 && mentionedBy.length === 0) {
    return null;
  }

  return (
    <>
      {mentions.length > 0 && (
        <ul className="log-entry-mentions">
          <li>Mentions:</li>
          {mentions.map((m) => (
            <li key={m.id}>
              <Link to={`/logbook/${entry.incidentId}#${m.id}`} onClick={() => onMentionClick(m)}>{m.label}</Link>
            </li>
          ))}
        </ul>
      )}
      {mentionedBy.length > 0 && (
        <ul className="log-entry-mentions">
          <li>Mentioned by:</li>
          {mentionedBy.map((m) => (
            <li key={m.id}>
              <Link to={`#${m.id}`} onClick={() => onMentionClick(m)}>{m.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Mentions;
