// Global imports
import { Link } from 'react-router-dom';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { location } from '../location';
import { locationLink } from '../locationLink';

type Props = {
  entry: LogEntry;
};
export function LocationValue({ entry }: Readonly<Props>) {
  const href = locationLink(entry);
  const text = location(entry);
  if (href) {
    return <Link to={href}>{text}</Link>;
  }
  return text;
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
