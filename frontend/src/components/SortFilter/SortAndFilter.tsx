// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import {
  Drawer, Box, Stack, Typography, IconButton, Divider, Button, Chip,
  List, ListItemButton, ListItemText,
  TextField, Radio,
  Checkbox, ListItem
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { useEffect, useMemo, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SortIcon from '@mui/icons-material/Sort';

import {
  SortAndFilterProps, QueryState, FilterNode, GroupNode,
  TextLeaf, DateRangeLeaf,
  OptionLeaf
} from './filter-types';
import { countActive, countActiveForGroup } from './filter-utils';


type Page =
  | { kind: 'list'; title: string; nodes: FilterNode[] }
  | { kind: 'select'; title: string; group: GroupNode }
  | { kind: 'text'; title: string; node: TextLeaf }
  | { kind: 'date-range'; title: string; node: DateRangeLeaf };

export function SortAndFilter({
  open,
  onClose,
  title,
  sort,
  initial,
  onApply,
  tree,
}: Readonly<SortAndFilterProps>) {

  const initialState: QueryState = useMemo(() => ({
    sort: initial?.sort ?? (sort?.length ? { by: sort[0].id, direction: 'desc' } : undefined),
    values: { ...(initial?.values ?? {}) },
  }), [initial, sort]);

  const baselineRef = useRef<QueryState | null>(null);

  useEffect(() => {
    if (open && baselineRef.current == null) {
      baselineRef.current = initialState;
    }
  }, [open, initialState]);

  const [local, setLocal] = useState<QueryState>(initialState);
  const [appliedState, setAppliedState] = useState<QueryState>(initialState);
  const baseline = baselineRef.current ?? initialState;

  const canApply = useMemo(() =>
    JSON.stringify(local) !== JSON.stringify(appliedState),
  [local, appliedState]);

  const canClear = useMemo(() =>
    JSON.stringify(local) !== JSON.stringify(baseline),
  [local, baseline]);

  const timeSelection = local.values.time;
  const timeRange = (local.values.timeRange as { from?: string; to?: string } | undefined) ?? undefined;

  const isCustomTime = timeSelection === 'custom';
  const isTimeRangeComplete = !!(timeRange?.from && timeRange?.to);

  const customTimeConfigured =
  (!isCustomTime) || (isCustomTime && isTimeRangeComplete);

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

  const renderCountAndChevron = (activeCount: number) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {activeCount > 0 && (
        <Chip size="small" label={activeCount} />
      )}
      <ChevronRightIcon />
    </Box>
  );

  const renderListPage = (nodes: FilterNode[]) => {
    const visibleNodes = nodes.filter((n) => !n.hidden);
    const activeCounts: Record<string, number> = Object.fromEntries(
      visibleNodes.map((n) => [n.id, countActiveForGroup(local.values, n)])
    );

    return (
      <List>
        {visibleNodes.map((n) => {
          const activeCount = activeCounts[n.id];

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
                  {renderCountAndChevron(activeCount)}
                </ListItemButton>
              </ListItem>
            );
          }
  
          if (n.type === 'text') {
            return (
              <ListItem key={n.id} disablePadding>
                <ListItemButton onClick={() => push({ kind: 'text', title: n.label, node: n })}>
                  <ListItemText primary={n.label} />
                  {renderCountAndChevron(activeCount)}
                </ListItemButton>
              </ListItem>
            );
          }
  
          if (n.type === 'date-range') {
            return (
              <ListItem key={n.id} disablePadding>
                <ListItemButton onClick={() => push({ kind: 'date-range', title: n.label, node: n })}>
                  <ListItemText primary={n.label} secondary={n.helperText} />
                  {renderCountAndChevron(activeCount)}
                </ListItemButton>
              </ListItem>
            );
          }
  
          return null;
        })}
      </List>
    );
  };
  
  const renderSelectPage = (group: GroupNode) => {
    const isMulti = group.selection === 'multi';

    let current;

    if (group.id === 'sort') {
      current = local.sort?.by;
    } else if (group.selection === 'multi') {
      current = local.values[group.id] ?? [];
    } else {
      current = local.values[group.id];
    }

    const selected = new Set(Array.isArray(current) ? current : []);
    const options = group.children.filter((c): c is OptionLeaf => c.type === 'option');

    const implied = new Set<string>();
    options
      .filter((opt) => selected.has(opt.id) && Array.isArray(opt.implies))
      .flatMap((opt) => opt.implies ?? [])
      .forEach((id) => implied.add(id));

    const effectiveSelection = new Set([...selected, ...implied]);
  
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
  
      let updated: string[];
      if (existing.includes(id)) {
        updated = existing.filter((v) => v !== id);
      } else {
        updated = [...existing, id];
      }
      setValue(key, updated);
    };
  
    return (
      <List>
        {nodes.map((c) => {
          if (c.type === 'option') {
            const isImplied = implied.has(c.id);
            const isSelected = isMulti
              ? effectiveSelection.has(c.id)
              : current === c.id;
            return (
              <ListItem key={c.id} disablePadding>
                <ListItemButton
                  disabled={isImplied}
                  onClick={() => {
                    if (isMulti && !implied.has(c.id)) {
                      handleMultiToggle(group.id, c.id);
                    } else if (!isMulti) {
                      setSingleSelect(group.id, c.id);
                    }
                  }}
                >
                  <ListItemText primary={c.label} secondary={c.helperText} sx={isImplied ? { color: 'text.disabled' } : undefined}/>
                  {isMulti ? (
                    <Checkbox
                      checked={isSelected}
                      tabIndex={-1}
                      disableRipple
                      edge="end"
                      disabled={isImplied}
                      slotProps={{ input: { 'aria-label': c.label } }}
                    />
                  ) : (
                    <Radio checked={isSelected} tabIndex={-1} disableRipple edge="end" />
                  )}
                </ListItemButton>
              </ListItem>
            );
          }
          
          if (c.type === 'group') {
            return (
              <ListItem key={c.id} disablePadding>
                <ListItemButton onClick={() => push({ kind: 'select', title: c.label, group: c })}>
                  <ListItemText primary={c.label} secondary={c.helperText} />
                  <ChevronRightIcon />
                </ListItemButton>
              </ListItem>
            );
          }
          
          if (c.type === 'date-range') {
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
    const clampToMinute = (d: Dayjs | null) => (d ? d.second(0).millisecond(0) : null);
    const fmt = (d: Dayjs | null) => (d ? d.format('YYYY-MM-DDTHH:mm:ss') : undefined);

    const v = (local.values[node.id] as { from?: string; to?: string }) ?? {};
    const fromVal = v.from ? dayjs(v.from) : null;
    const toVal   = v.to   ? dayjs(v.to)   : null;

    const fromNorm = clampToMinute(fromVal);
    const toNorm   = clampToMinute(toVal);

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={2} sx={{ p: 2 }}>
          <DateTimePicker
            label="From"
            value={fromNorm}
            disablePast={false}
            onChange={(newVal) => setValue(node.id, { ...v, from: fmt(clampToMinute(newVal)) })}
            views={['year','month','day','hours','minutes']}
            viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock }}
            maxDateTime={toNorm ?? undefined}
            referenceDate={(fromNorm ?? toNorm ?? dayjs().startOf('day'))}
            slotProps={{
              textField: { fullWidth: true, id: 'from' },
              openPickerButton: { 'aria-label': 'Open From date-time picker' },
            }}
          />

          <DateTimePicker
            label="To"
            value={toNorm}
            disablePast={false}
            onChange={(newVal) => setValue(node.id, { ...v, to: fmt(clampToMinute(newVal)) })}
            views={['year','month','day','hours','minutes']}
            viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock }}
            minDateTime={fromNorm ?? undefined}
            referenceDate={(toNorm ?? fromNorm ?? dayjs().startOf('day'))}
            slotProps={{
              textField: { fullWidth: true, id: 'to' },
              openPickerButton: { 'aria-label': 'Open To date-time picker' },
            }}
          />
        </Stack>
      </LocalizationProvider>
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
              onClick={() => { 
                setAppliedState(local);
                onApply(local); 
                onClose(); 
              }}
              disabled={!customTimeConfigured || !canApply}
            >
              Apply
            </Button>
            <Button
              variant="outlined" fullWidth
              onClick={() => {
                setLocal(baseline);
                setAppliedState(baseline);
                onApply(baseline);
                onClose();
              }}
              disabled={!canClear}
            >
              Clear
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
