// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useState, MouseEvent } from 'react';
import { Box, ButtonBase, Menu, MenuItem, ListItemIcon, ListItemText, Typography, Grid2 as Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { type IncidentStage } from 'common/IncidentStage';
import StageMini from './StageMini';
import Format from '../../utils/Format';

const STAGES: IncidentStage[] = ['Monitoring', 'Response', 'Recovery', 'Closed'];

type Props = {
  value: IncidentStage;
  onChange: (next: IncidentStage) => void;
  disabled?: boolean;
};

export default function StageSelectListItem({ value, onChange, disabled = false }: Readonly<Props>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const menuId = 'stage-select-menu';

  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Grid component="li" size={{ xs: 12, md: 6 }}>
      <Box display="flex" flexDirection="column" gap={1}>
        <ButtonBase
          color='primary'
          onClick={handleOpen}
          disabled={disabled}
          aria-haspopup="menu"
          aria-controls={open ? menuId : undefined}
          aria-expanded={open ? 'true' : undefined}
          disableRipple
          sx={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 0, py: 0,
            fontSize: '1rem',
            lineHeight: 1,
            color: 'primary.main',
          }}
        >
          <Typography variant="h3" fontWeight="bold" component="span" sx={{ fontSize: 'inherit', lineHeight: 1, m: 0 }}>
            Stage
          </Typography>
          <ArrowDropDownIcon fontSize="small" />
        </ButtonBase>

        <Box display="flex" alignItems="center" gap={1}>
          <StageMini stage={value} size={12} />
          <Typography variant="body1">{Format.incident.stage(value)}</Typography>
        </Box>

        <Menu id={menuId} anchorEl={anchorEl} open={open} onClose={handleClose}>
          {STAGES.map((s) => (
            <MenuItem
              key={s}
              selected={s === value}
              onClick={() => { onChange(s); handleClose(); }}
            >
              <ListItemIcon><StageMini stage={s} size={12} /></ListItemIcon>
              <ListItemText primary={Format.incident.stage(s)} />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Grid>
  );
}
