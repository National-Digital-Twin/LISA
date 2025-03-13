// Global imports
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  to: string;
  active: boolean;
  inError: boolean;
}
export default function FilesTab({ to, active, inError }: Readonly<Props>) {
  const classes: string = useMemo(() => {
    const arr: Array<string> = [];
    if (active) arr.push('active');
    if (inError) arr.push('in-error');
    return arr.join(' ');
  }, [active, inError]);
  return (
    <Link to={to} className={classes}>
      Form
    </Link>
  );
}
