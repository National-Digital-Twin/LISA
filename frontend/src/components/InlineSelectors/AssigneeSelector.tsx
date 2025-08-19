// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useState, MouseEvent } from 'react';
import { Box, ButtonBase, Menu, MenuItem, ListItemText, Typography, Grid2 as Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { User } from 'common/User';

type Props = {
  value: User;
  availableValues?: User[],
  onChange: (next: User) => void;
  disabled?: boolean;
};

export default function AssigneeSelector({ value, availableValues = [], onChange, disabled = false }: Readonly<Props>) {
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
            Assigned to
          </Typography>
          <ArrowDropDownIcon fontSize="small" />
        </ButtonBase>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1">{value?.displayName}</Typography>
        </Box>

        <Menu id={menuId} anchorEl={anchorEl} open={open} onClose={handleClose}>
          {availableValues.map((s) => (
            <MenuItem
              key={s.username}
              selected={s === value}
              onClick={() => { onChange(s); handleClose(); }}
            >
              <ListItemText primary={s.displayName} />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Grid>
  );
}
