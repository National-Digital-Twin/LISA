// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type LogEntry } from 'common/LogEntry';
import { Typography } from '@mui/material';
import { Format } from '../../../utils';
import Stage from '../../Stage';

interface Props {
  entry: LogEntry;
}
export default function ChangeStage({ entry }: Readonly<Props>) {
  const { stage } = entry;
  if (!stage) {
    return null;
  }

  return (
    <>
      <Typography variant="body1" fontWeight="bold" mb={1}>
        Stage changed to
      </Typography>
      <Stage label={Format.incident.stage(stage)} stage={stage} />
    </>
  );
}
