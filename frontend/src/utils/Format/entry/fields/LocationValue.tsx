// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Link } from 'react-router-dom';
import { type LogEntry } from 'common/LogEntry';
import { type Location as LocationUnion } from 'common/Location';
import { Task } from 'common/Task';

// Local imports
import { location } from '../location';
import { hasPlottableCoordinates } from '../locationLink';

type Props = {
  entity: LogEntry | Task;
};
export function LocationValue({ entity }: Readonly<Props>) {
  const text = location(entity.location);

  const canPlot = hasPlottableCoordinates(entity.location as LocationUnion | null | undefined);

  if (canPlot) {
    return (
      <Link to="/location" state={entity}>
        {text}
      </Link>
    );
  }

  return <>{text}</>;
}