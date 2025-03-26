import { MouseEvent } from 'react';

import { type LogEntry } from 'common/LogEntry';
import { Box } from '@mui/material';
import ChangeStage from './ChangeStage';
import Default from './Default';
import SetInformation from './SetInformation';

interface Props {
  entry: LogEntry;
  onContentClick: (evt: MouseEvent<HTMLElement>) => void;
}
export default function Details({ entry, onContentClick }: Readonly<Props>) {
  const { type } = entry;
  let detail = null;
  switch (type) {
    case 'ChangeStage':
      detail = <ChangeStage entry={entry} />;
      break;
    case 'SetIncidentInformation':
      detail = <SetInformation entry={entry} />;
      break;
    default:
      detail = <Default entry={entry} />;
      break;
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      border="none"
      alignItems="flex-start"
      onClick={onContentClick}
    >
      {detail}
    </Box>
  );
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
