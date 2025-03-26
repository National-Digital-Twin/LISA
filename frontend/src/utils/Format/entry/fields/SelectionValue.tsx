// Global imports
import { Link } from 'react-router-dom';

// Local imports
import { type LogEntry } from 'common/LogEntry';

interface Props {
  entry: LogEntry;
  value: string | string[] | undefined;
}
export function SelectionValue({ entry, value }: Readonly<Props>) {
  if (!value) {
    return null;
  }
  return (
    <Link to={`/logbook/${entry.incidentId}#${value}`}>
      View linked
    </Link>
  );
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
