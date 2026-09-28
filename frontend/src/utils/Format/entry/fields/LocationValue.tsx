// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Global imports
import { Link } from 'react-router-dom';
import { type LogEntry } from 'common/LogEntry';
import { Task } from 'common/Task';

// Local imports
import { location } from '../location';
import { hasPlottableCoordinates } from '../locationLink';

type Props = {
  entity: LogEntry | Task;
};
export function LocationValue({ entity }: Readonly<Props>) {
  const text = location(entity);

  const canPlot = hasPlottableCoordinates(entity.location);

  if (canPlot) {
    return (
      <Link to="/location" state={entity}>
        {text}
      </Link>
    );
  }

  return <>{text}</>;
}