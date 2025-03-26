// Global imports
import { useState, useRef, useEffect, RefObject } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Stage as StageType } from 'konva/lib/Stage';

// Local imports
import '../assets/images/icon-pencil.svg';
import { Button } from '@mui/material';
import { SketchLine } from '../utils/types';

interface Props {
  lines: SketchLine[];
  setLines: (lines: SketchLine[]) => void;
  canvasRef: RefObject<StageType>;
  active: boolean;
}

const PEN_OPTIONS = [
  { color: 'black', label: 'black', hex: '#000000' },
  { color: 'red', label: 'red', hex: '#ff0000' },
  { color: 'blue', label: 'blue', hex: '#0000ff' },
  { color: 'green', label: 'green', hex: '#00ff00' },
  { color: 'yellow', label: 'yellow', hex: '#ffff00' }
];

const Sketch = ({ lines, setLines, canvasRef, active }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({
    width: container.current?.offsetWidth ?? 0,
    height: container.current?.offsetHeight ?? 0
  });
  const [penColor, setPenColor] = useState(PEN_OPTIONS[0].color);
  const isDrawing = useRef(false);

  const startDrawing = (e: KonvaEventObject<Event>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) {
      return;
    }
    // Add the point twice so that we immediately get a line of 1
    // pixel in length. Otherwise, there will be no line drawn at all.
    const points = [pos.x, pos.y, pos.x, pos.y];
    setLines([...lines, { points, color: penColor }]);
  };

  const draw = (e: KonvaEventObject<Event>) => {
    if (!isDrawing.current) {
      return;
    }
    e.evt.preventDefault();
    const point = e.target.getStage()?.getPointerPosition();
    if (!point) {
      return;
    }
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    startDrawing(e);
  };

  const handleTouchStart = (e: KonvaEventObject<TouchEvent>) => {
    startDrawing(e);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    draw(e);
  };

  const handleTouchMove = (e: KonvaEventObject<TouchEvent>) => {
    draw(e);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleTouchEnd = () => {
    isDrawing.current = false;
  };

  const resize = () => {
    if (container.current) {
      setSize({
        width: container.current.offsetWidth,
        height: container.current.offsetHeight
      });
    }
  };

  // this allows the canvas to resize to the container as it requires a fixed size
  useEffect(() => {
    if (active) {
      resize();
      window.addEventListener('resize', resize);
    } else {
      window.removeEventListener('resize', resize);
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <div className="sketch-stage" ref={container}>
      <Stage
        width={size.width}
        height={size.height}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              // eslint-disable-next-line react/no-array-index-key
              key={`${line.color}-${i}-${line.points.length}`}
              points={line.points}
              stroke={line.color}
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
      <div className="pens">
        {PEN_OPTIONS.map((pen) => (
          <Button
            key={pen.color}
            sx={{ borderRadius: 'unset', backgroundColor: pen.hex, minWidth: 30, minHeight: 30 }}
            onClick={() => setPenColor(pen.color)}
            aria-label={`Select ${pen.label} pen`}
          />
        ))}
      </div>
      <div className="clear">
        <Button
          variant="contained"
          onClick={() => setLines([])}
          className="sketch-clear"
          disabled={!lines.length}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default Sketch;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
