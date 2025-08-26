// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Typography } from '@mui/material';
import { type Incident } from 'common/Incident';
import DataList, { type ListRow } from './DataList';
import { Format } from '../utils';
import StageMini from './Stage/StageMini';

type Props = {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
  title?: string;
};

export default function IncidentPicker({
  incidents,
  onSelect,
}: Readonly<Props>) {
  const items: ListRow[] = incidents.map((i) => ({
    key: i.id,
    title: i.name,
    titleDot: <StageMini stage={i.stage} />,
    content: <Typography variant="body2">{Format.user(i.reportedBy)}</Typography>,
    footer: Format.date(i.startedAt),
    onClick: () => onSelect(i)
  }));

  return (
    <Box sx={{ backgroundColor: 'background.default'}}>
      <DataList items={items} />
    </Box>
  );
}
