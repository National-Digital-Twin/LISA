// Global imports
import { Link } from 'react-router-dom';

interface Props {
  to: string;
  active: boolean;
  fileCount: number;
}
export default function FilesTab({ to, active, fileCount }: Readonly<Props>) {
  return (
    <Link to={to} className={active ? 'active' : ''}>
      Files (
      {fileCount}
      )
    </Link>
  );
}
