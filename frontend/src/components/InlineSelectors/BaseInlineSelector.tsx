// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useState, MouseEvent, ReactNode } from 'react';
import { Box, ButtonBase, Menu, MenuItem, ListItemIcon, ListItemText, Typography, Grid2 as Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

type RenderOptionResult = {
  icon?: ReactNode;
  label: string;
};

type BaseInlineSelectorProps<T> = {
  label: string;
  valueNode: ReactNode;
  options: readonly T[];
  onChange: (next: T) => void;
  getOptionKey: (opt: T) => string;
  renderOption: (opt: T) => RenderOptionResult;
  isSelected: (opt: T) => boolean;
  disabled?: boolean;
  idSeed?: string;
};

export default function BaseInlineSelector<T>({
  label,
  valueNode,
  options,
  onChange,
  getOptionKey,
  renderOption,
  isSelected,
  disabled = false,
  idSeed = label.toLowerCase().replace(/\s+/g, '-'),
}: Readonly<BaseInlineSelectorProps<T>>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const menuId = `${idSeed}-inline-select-menu`;

  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Grid component="li" size={{ xs: 12, md: 6 }}>
      <Box display="flex" flexDirection="column" gap={1}>
        <ButtonBase
          color="primary"
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
          <Typography
            variant="h3"
            fontWeight="bold"
            component="span"
            sx={{ fontSize: 'inherit', lineHeight: 1, m: 0 }}
          >
            {label}
          </Typography>
          <ArrowDropDownIcon fontSize="small" />
        </ButtonBase>

        <Box display="flex" alignItems="center" gap={1}>
          {valueNode}
        </Box>

        <Menu id={menuId} anchorEl={anchorEl} open={open} onClose={handleClose}>
          {options.map((opt) => {
            const { icon, label } = renderOption(opt);
            return (
              <MenuItem
                key={getOptionKey(opt)}
                selected={isSelected(opt)}
                onClick={() => { onChange(opt); handleClose(); }}
              >
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={label} />
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
    </Grid>
  );
}
