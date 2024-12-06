// Local imports
import { type LogEntry } from 'common/LogEntry';

const SEARCHABLE_PROPS: Array<string> = [
  'content.text',
  'location.description',
  'sequence',
  'stage'
];

/**
 * This function uses any explicitly because it means we can
 * theoretically use it for any type of object - and in the
 * cases where this is currently called, it's used for LogEntry,
 * LogEntryContent, Location, and Field.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function propMatches(obj: any, text: string, path: string): boolean {
  const parts = path.split('.');
  const prop: string = parts.shift() as string;
  const val = (obj && Object.hasOwn(obj, prop)) ? obj[prop] : undefined;

  // If this is nested, recurse.
  if (parts.length > 0) {
    return propMatches(val, text, parts.join('.'));
  }

  if (typeof val === 'string') {
    return val.toLowerCase().includes(text);
  }
  return false;
}

function anyFieldValueMatches(e: LogEntry, text: string): boolean {
  if (Array.isArray(e.fields)) {
    return e.fields.some((field) => propMatches(field, text, 'value'));
  }
  return false;
}

export function searchTextMatches(e: LogEntry, searchText: string): boolean {
  const text = searchText.trim().toLowerCase();
  if (text.length > 0) {
    return anyFieldValueMatches(e, text)
      || SEARCHABLE_PROPS.some((path: string) => propMatches(e, text, path));
  }
  return true;
}
