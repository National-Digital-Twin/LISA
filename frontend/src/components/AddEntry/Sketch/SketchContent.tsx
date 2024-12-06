// Global imports
import { type Stage } from 'konva/lib/Stage';
import { RefObject } from 'react';

// Local imports
import { bem } from '../../../utils';
import { type SketchLine } from '../../../utils/types';
import Sketch from '../../Sketch';

interface Props {
  active: boolean;
  lines: Array<SketchLine>;
  onChangeLines: (lines: Array<SketchLine>) => void;
  canvasRef: RefObject<Stage>;
}

export default function SketchContent({
  active,
  lines,
  onChangeLines,
  canvasRef
}: Props) {
  const classes = bem('add-entry-tab', [active ? 'active' : ''], 'sketch');
  return (
    <ul className={classes()}>
      <li className="full-width">
        <Sketch
          canvasRef={canvasRef}
          lines={lines}
          setLines={onChangeLines}
          active={active}
        />
      </li>
    </ul>
  );
}
