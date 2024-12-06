// Global imports
import { PropsWithChildren } from 'react';

// Local imports
import bem, { ModifiersType } from '../utils/bem';

type PropsType = PropsWithChildren & {
  classModifiers?: ModifiersType;
}
const Readonly = ({ classModifiers = [], children }: PropsType) => {
  const classes = bem('readonly', classModifiers);
  return <div className={classes()}>{children}</div>;
};

export default Readonly;
