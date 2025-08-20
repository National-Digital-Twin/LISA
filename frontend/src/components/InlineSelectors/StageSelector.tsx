// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Typography } from '@mui/material';
import BaseInlineSelector from './BaseInlineSelector';
import { type IncidentStage } from 'common/IncidentStage';
import StageMini from '../Stage/StageMini';
import Format from '../../utils/Format';

const STAGES: readonly IncidentStage[] = ['Monitoring', 'Response', 'Recovery', 'Closed'] as const;

type Props = {
  value: IncidentStage;
  onChange: (next: IncidentStage) => void;
  disabled?: boolean;
};

export default function StageSelector({ value, onChange, disabled = false }: Readonly<Props>) {
  return (
    <BaseInlineSelector<IncidentStage>
      label="Stage"
      disabled={disabled}
      valueNode={
        <>
          <StageMini stage={value} size={12} />
          <Typography variant="body1">{Format.incident.stage(value)}</Typography>
        </>
      }
      options={STAGES}
      onChange={onChange}
      getOptionKey={(s) => s}
      isSelected={(s) => s === value}
      renderOption={(s) => ({
        icon: <StageMini stage={s} size={12} />,
        label: Format.incident.stage(s),
      })}
      idSeed="incident-stage"
    />
  );
}
