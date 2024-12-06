// Local imports
import { type LogEntry } from 'common/LogEntry';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';
import bem from '../../../bem';
import { FieldItem } from './FieldItem';
import { GroupItem } from './GroupItem';

const classes = bem('log-entry-fields');

export function fields(entry: LogEntry) {
  const type = LogEntryTypes[entry.type];
  if (!type) {
    return null;
  }

  const entryFields = type.fields(entry);
  if (entryFields.length > 0) {
    if (type.groups) {
      return (
        <div className={classes()}>
          {type.groups.map((group) => (
            <GroupItem key={group.id} group={group} fields={entryFields} entry={entry} />
          ))}
        </div>
      );
    }
    return (
      <div className={classes()}>
        {entryFields.map((field) => (
          <FieldItem key={field.id} field={field} entry={entry} />
        ))}
      </div>
    );
  }
  return null;
}
