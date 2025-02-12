// Local imports
import { bem } from '../../../utils';
import { type ValidationError } from '../../../utils/types';
import Tabs from './Tabs';

interface Props {
  hash: string;
  fileCount: number;
  validationErrors: Array<ValidationError>;
  showValidationErrors: boolean;
}
export default function Header({
  hash,
  fileCount,
  validationErrors,
  showValidationErrors
}: Readonly<Props>) {
  const classes = bem('rollup-header', [], showValidationErrors ? 'validation-errors' : '');
  return (
    <h2 className={classes()}>
      Create new log entry
      <Tabs hash={hash} fileCount={fileCount} validationErrors={validationErrors} />
    </h2>
  );
}
