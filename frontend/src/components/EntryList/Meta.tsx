// Local imports
import { type LogEntry } from 'common/LogEntry';
import { Format, Icons } from '../../utils';
import bem from '../../utils/bem';

const Meta = ({ entry }: { entry: LogEntry }) => {
  const classes = bem('log-entry-meta', []);
  return (
    <div className={classes()}>
      <div>
        <Icons.Tag />
        {Format.entry.type(entry.type)}
      </div>
      <div className={classes('to-right')}>
        <Icons.Person />
        {Format.user(entry.author)}
      </div>
      <div>
        <Icons.Calendar />
        {Format.date(entry.dateTime)}
      </div>
      <div>
        <Icons.Clock />
        {Format.time(entry.dateTime)}
      </div>
    </div>
  );
};

export default Meta;
