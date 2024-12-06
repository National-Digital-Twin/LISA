// Local imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { LocationTypes } from 'common/Location';
import bem from '../utils/bem';

type Props = {
  id: string;
  value: string | undefined;
  onClick: () => void
};
export default function LocationField({ id, value, onClick }: Props) {
  const classes = bem('location-field');
  return (
    <div id={id} className={classes()}>
      <span className={classes('value')}>
        {value === 'View location' ? LocationTypes.coordinates : value }
      </span>
      <button type="button" className={classes('button')} onClick={onClick}>
        {value ? 'Change' : 'Set'}
      </button>
    </div>
  );
}
