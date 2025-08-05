// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import {
  Drawer, Box, Stack, Typography, IconButton, Divider, Button, Chip,
  List, ListItemButton, ListItemText,
  TextField, Radio,
  Checkbox, ListItem
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SortIcon from '@mui/icons-material/Sort';

import {
  SortAndFilterProps, QueryState, FilterNode, GroupNode,
  TextLeaf, DateRangeLeaf
} from './filter-types';

type Page =
  | { kind: 'list'; title: string; nodes: FilterNode[] }
  | { kind: 'select'; title: string; group: GroupNode }
  | { kind: 'text'; title: string; node: TextLeaf }
  | { kind: 'date-range'; title: string; node: DateRangeLeaf };

function countActive(values: QueryState['values']) {
  return Object.entries(values).reduce((count, [key, v]) => {
    if (key === 'sort') return count;
    if (Array.isArray(v)) return v.length > 0 ? count + 1 : count;
    if (v == null || v === '') return count;
    if (typeof v === 'object') return Object.values(v).some(Boolean) ? count + 1 : count;
    return count + 1;
  }, 0);
}

export function SortAndFilter({
  open,
  onClose,
  title,
  sort,
  initial,
  onApply,
  onClear,
  tree,
}: SortAndFilterProps) {

  const initialState: QueryState = useMemo(() => ({
    sort: initial?.sort ?? (sort?.length ? { by: sort[0].id, direction: 'desc' } : undefined),
    values: { ...(initial?.values ?? {}) },
  }), [initial, sort]);

  const [local, setLocal] = useState<QueryState>(initialState);
  useEffect(() => setLocal(initialState), [open, initialState]);

  // Navigation stack
  const [stack, setStack] = useState<Page[]>([]);
  useEffect(() => {
    if (open) setStack([{ kind: 'list', title: tree.title ?? 'Sort & Filter', nodes: tree.items }]);
  }, [open, tree]);

  const push = (page: Page) => setStack((s) => [...s, page]);
  const pop = () => setStack((s) => s.slice(0, -1));
  const curr = stack[stack.length - 1];

  const setValue = (key: string, v: unknown) => {
    setLocal((prev) => ({ ...prev, values: { ...prev.values, [key]: v } }));
  };

  const setSingleSelect = (key: string, id: string) => {
    if (key === 'sort') {
      setLocal((prev) => ({ ...prev, sort: { by: id, direction: prev.sort?.direction ?? 'desc' } }));
    } else {
      setValue(key, id);
    }
  };

  const renderHeader = () => (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {stack.length > 1 ? (
          <IconButton onClick={pop} aria-label="Back">
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <SortIcon />
        )}
        <Typography variant="h6">{curr?.title ?? title ?? 'Filters'}</Typography>
        {stack.length === 1 && (
          <Chip size="small" label={`${countActive(local.values)}`} />
        )}
      </Stack>
      <IconButton onClick={onClose} aria-label="Close filter panel">
        <CloseIcon />
      </IconButton>
    </Stack>
  );

  const renderListPage = (nodes: FilterNode[]) => (
    <List>
      {nodes
        .filter((n) => !n.hidden)
        .map((n) => {
          if (n.type === 'group') {
            return (
              <ListItem key={n.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (n.selection === 'multi' || n.selection === 'single') {
                      push({ kind: 'select', title: n.label, group: n });
                    } else {
                      push({ kind: 'list', title: n.label, nodes: n.children });
                    }
                  }}
                >
                  <ListItemText primary={n.label} secondary={n.helperText} />
                  <ChevronRightIcon />
                </ListItemButton>
              </ListItem>
            );
          }
  
          if (n.type === 'text') {
            return (
              <ListItem key={n.id} disablePadding>
                <ListItemButton onClick={() => push({ kind: 'text', title: n.label, node: n })}>
                  <ListItemText primary={n.label} secondary={n.helperText} />
                  <ChevronRightIcon />
                </ListItemButton>
              </ListItem>
            );
          }
  
          if (n.type === 'date-range') {
            return (
              <ListItem key={n.id} disablePadding>
                <ListItemButton onClick={() => push({ kind: 'date-range', title: n.label, node: n })}>
                  <ListItemText primary={n.label} secondary={n.helperText} />
                  <ChevronRightIcon />
                </ListItemButton>
              </ListItem>
            );
          }
  
          return null;
        })}
    </List>
  );
  
  

  const renderSelectPage = (group: GroupNode) => {
    const isMulti = group.selection === 'multi';

    const current = group.id === 'sort'
      ? local.sort?.by
      : local.values[group.id] ?? (group.selection === 'multi' ? [] : undefined);

  
    const showCustomRange = group.id === 'time' && current === 'custom';
  
    const nodes = [...group.children];
    if (showCustomRange) {
      nodes.push({
        id: 'timeRange',
        type: 'date-range',
        label: 'Between',
      });
    }

    const handleMultiToggle = (key: string, id: string) => {
      const existing = (local.values[key] as string[] | undefined) ?? [];
      const updated = existing.includes(id)
        ? existing.filter((v) => v !== id)
        : [...existing, id];
      setValue(key, updated);
    };
  
    return (
      <List>
        {nodes.map((c) => {
          if (c.type === 'option') {
            const selected = isMulti
              ? (Array.isArray(current) && current.includes(c.id))
              : current === c.id;
            return (
              <ListItem key={c.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (isMulti) handleMultiToggle(group.id, c.id);
                    else setSingleSelect(group.id, c.id);
                  }}
                >
                  {isMulti ? (
                    <Checkbox
                      checked={selected}
                      tabIndex={-1}
                      disableRipple
                      edge="start"
                      slotProps={{ input: { 'aria-label': c.label } }}
                    />
                  ) : (
                    <Radio checked={selected} tabIndex={-1} disableRipple edge="start" />
                  )}
                  <ListItemText primary={c.label} secondary={c.helperText} />
                </ListItemButton>
              </ListItem>
            );
          } if (c.type === 'date-range') {
            return (
              <ListItemButton key={c.id} onClick={() => push({ kind: 'date-range', title: c.label, node: c })}>
                <ListItemText primary={c.label} secondary={c.helperText} />
                <ChevronRightIcon />
              </ListItemButton>
            );
          }
          return null;
        })}
      </List>
    );
  };
  

  const renderTextPage = (node: TextLeaf) => (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth size="medium" label={node.label}
        placeholder={node.placeholder}
        value={(local.values[node.id] as string) ?? ''}
        onChange={(e) => setValue(node.id, e.target.value)}
        helperText={node.helperText}
      />
    </Box>
  );

  const renderDateRangePage = (node: DateRangeLeaf) => {
    const v = (local.values[node.id] as { from?: string; to?: string }) ?? {};
    return (
      <Stack spacing={2} sx={{ p: 2 }}>
        <TextField
          fullWidth type="date" size="medium" label="From" InputLabelProps={{ shrink: true }}
          value={v.from ?? ''} onChange={(e) => setValue(node.id, { ...v, from: e.target.value || undefined })}
        />
        <TextField
          fullWidth type="date" size="medium" label="To" InputLabelProps={{ shrink: true }}
          value={v.to ?? ''} onChange={(e) => setValue(node.id, { ...v, to: e.target.value || undefined })}
        />
      </Stack>
    );
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} ModalProps={{ keepMounted: true }}>
      <Box sx={{ width: { xs: '90vw', sm: 420 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {renderHeader()}
        <Divider />

        <Box sx={{ p: 0, pb: 10, overflowY: 'auto', flex: 1 }}>
          {curr?.kind === 'list' && renderListPage(curr.nodes)}
          {curr?.kind === 'select' && renderSelectPage(curr.group)}
          {curr?.kind === 'text' && renderTextPage(curr.node)}
          {curr?.kind === 'date-range' && renderDateRangePage(curr.node)}
        </Box>

        <Box sx={{
          p: 2, borderTop: 1, borderColor: 'divider', position: 'sticky', bottom: 0,
          backgroundColor: 'background.paper'
        }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained" fullWidth
              onClick={() => { onApply(local); onClose(); }}
            >
              Apply
            </Button>
            <Button
              variant="outlined" fullWidth
              onClick={() => {
                setLocal({ sort: sort?.length ? { by: sort[0].id, direction: 'desc' } : undefined, values: {} });
                onClear?.();
              }}
            >
              Clear
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
