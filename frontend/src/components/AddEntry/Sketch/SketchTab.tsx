// Global imports
import { Link } from 'react-router-dom';

interface Props {
  to: string;
  active: boolean;
}
export default function SketchTab({ to, active }: Props) {
  return (
    <Link to={to} className={active ? 'active' : ''}>
      Sketch
    </Link>
  );
}
