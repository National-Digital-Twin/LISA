// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { v4 as uuidV4 } from 'uuid';

import { type Mentionable, type MentionableType } from 'common/Mentionable';
import { type LogEntry } from 'common/LogEntry';

import { AddEntry, EntryList, PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import {
  useCreateLogEntry,
  useIncidents,
  useLogEntries,
  useLogEntriesUpdates,
} from '../hooks';
import { Format } from '../utils';
import { type OnCreateEntry } from '../utils/handlers';
import { type SpanType } from '../utils/types';
import { useResponsive } from '../hooks/useResponsiveHook';
import { useIsOnline } from '../hooks/useIsOnline';
import { logInfo } from '../utils/logger';

// Sort & Filter schema + types
import { SortAndFilter } from '../components/SortFilter/SortAndFilter';
import { buildLogFilters, logSort } from '../components/SortFilter/schemas/log-schema';
import { type QueryState } from '../components/SortFilter/filter-types';
import { useFormTemplates } from '../hooks/Forms/useFormTemplates';
import { getFromAndToFromTimeSelection } from '../components/SortFilter/filter-utils';

const Logbook = () => {
  const { incidentId } = useParams();
  const query = useIncidents();
  const { logEntries } = useLogEntries(incidentId);
  const { createLogEntry } = useCreateLogEntry(incidentId);
  const { startPolling, clearPolling } = useLogEntriesUpdates(incidentId!);
  const isOnline = useIsOnline();
  const { forms } = useFormTemplates();
  const [adding, setAdding] = useState<boolean>(false);
  const { isMobile } = useResponsive();
  const navigate = useNavigate();

  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [queryState, setQueryState] = useState<QueryState>({
    values: {},
    sort: { by: "date_desc", direction: 'desc' },
  });

  const allAuthors = useMemo(() => {
    const seen = new Set<string>();
    return (logEntries ?? [])
      .map((e) => {
        const a = e.author;
        if (!a) return null;
        const name = typeof a === 'string' ? a : a.displayName ?? '';
        return name.trim();
      })
      .filter((name): name is string => {
        if (!name || seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .sort((a, b) => a.localeCompare(b));
  }, [logEntries]);
  
  const logFilters = useMemo(() => {
    const templates = forms ?? [];
    return buildLogFilters(templates, allAuthors);
  }, [allAuthors, forms]);
  
  useEffect(() => {
    const preventRefresh = (ev: BeforeUnloadEvent) => {
      const lastEntry = logEntries?.at(-1);
      const hasOffline = lastEntry?.offline === true;
      if (hasOffline || adding) ev.preventDefault();
    };
    window.addEventListener('beforeunload', preventRefresh);
    return () => window.removeEventListener('beforeunload', preventRefresh);
  }, [adding, logEntries]);

  useEffect(() => {
    if (isOnline) startPolling();
    else clearPolling();
  }, [isOnline, startPolling, clearPolling]);

  const incident = query?.data?.find((inc) => inc.id === incidentId);

  const onCancel = () => {
    document.documentElement.scrollTo(0, 0);
    setAdding(false);
  };

  const onAddEntryClick = () => {
    navigate('#');
    setAdding(true);
  };

  const onAddEntry: OnCreateEntry = (entry, files) => {
    createLogEntry({ logEntry: { id: uuidV4(), ...entry }, attachments: files });
    setTimeout(() => {
      setAdding(false);
      document.documentElement.scrollTo(0, 0);
    }, 500);
    return undefined;
  };

  const onMentionClick = (mention: Mentionable) => {
    if (mention.type === 'User') {
      logInfo(`Clicked on user ${mention.id}: ${mention.label}`);
      navigate('#');
    } else if (mention.type === 'File') {
      navigate('#');
      const [entryId, fileName] = mention.id.split('::');
      const parentEntry = logEntries?.find((ent) => ent.id === entryId);
      const attachment = parentEntry?.attachments?.find((att) => att.name === fileName);
      if (attachment && attachment.scanResult === 'NO_THREATS_FOUND') {
        window.open(
          `api/files/${attachment.key}/${attachment.name}?mimeType=${attachment.mimeType}`,
          attachment.key
        );
      }
    } else {
      navigate(`#${mention.id}`);
    }
  };

  const onContentClick = (evt: MouseEvent<HTMLElement>) => {
    const target: SpanType = evt.target as unknown as SpanType;
    if (target?.getAttribute('data-lexical-mention')) {
      onMentionClick({
        id: target.getAttribute('data-lexical-mention') as string,
        type: target.getAttribute('data-lexical-mention-type') as MentionableType,
        label: target.textContent ?? '',
      });
    } else if (target.tagName !== 'A') {
      navigate('#');
    }
  };

  const getTs = (e: LogEntry) => {
    const raw = e.dateTime;
    return raw ? new Date(raw).getTime() : 0;
  };

  const getAuthor = (e: LogEntry) => {
    const a = e.author;
    if (!a) return '';
    if (typeof a === 'string') return a;
    return a.displayName ?? '';
  };

  const toId = (s: string) => s.toLowerCase().replace(/[\s_()/\-.:]+/g, '');

  const visibleEntries = useMemo(() => {
    const items = (logEntries ?? []).slice();
    const v = queryState.values;

    // memo helpers

    const getTypeIds = (e: LogEntry): string[] => {
      const t = e.type;
      if (!t) return [];
  
      const raw = (typeof t === 'string' && t) || '';
      if (!raw) return [];
  
      const id = toId(raw);
      const ids: string[] = [id];
  
      return ids;
    };

    const matchesAttachmentFilter = (entry: LogEntry, selected: Set<string>): boolean => {
      if (selected.size === 0) return true;
    
      return Array.from(selected).some((type) => {
        if (type === 'location') return !!entry.location;
        if (type === 'file') return entry.attachments?.some((a) => a.type === 'File');
        if (type === 'sketch') return entry.attachments?.some((a) => a.type === 'Sketch');
        if (type === 'recording') return entry.attachments?.some((a) => a.type === 'Recording');
        return false;
      });
    };
    

    // Attachment
    const selectedAttachments = new Set<string>((v.attachment as string[]) ?? []);

    // Author
    const selectedAuthors = new Set<string>((v.author as string[]) ?? []);

    // Types from Form/Task/Update
    const selectedTypes = new Set<string>(
      Object.entries(v)
        .filter(([key, val]) => key === 'logType' && Array.isArray(val))
        .flatMap(([, val]) => val as string[])
        .concat(
          Object.entries(v)
            .filter(([key, val]) => key.startsWith('logType.') && Array.isArray(val))
            .flatMap(([, val]) => val as string[])
        )
    );

    // Date range
    const customTimeRange = v.timeRange as { from?: string; to?: string } | undefined;
    const preset = v.time as string | undefined;
    
    const {from, to} = getFromAndToFromTimeSelection(preset, customTimeRange);

    const filtered = items.filter((e) => {
      // attachment
      if (!matchesAttachmentFilter(e, selectedAttachments)) return false;

      // author
      if (selectedAuthors.size > 0 && !selectedAuthors.has(getAuthor(e).toLowerCase().replace(/\s+/g, '-'))) {
        return false;
      }

      // types
      if (selectedTypes.size > 0) {
        const types = getTypeIds(e);
      
        const isTaskMatch = selectedTypes.has('task') && e.task;
        const isFormMatch = selectedTypes.has(`form::${(e.details?.submittedFormTemplateId ?? '')}`) ?? false;
        const hasAny = types.some((t) => selectedTypes.has(t));
      
        if (!isTaskMatch && !isFormMatch && !hasAny) return false;
      }

      // date range
      const ts = getTs(e);
      if (from != null && ts < from) return false;
      if (to != null && ts > to) return false;

      return true;
    });

    // sort
    const sortKey = queryState.sort?.by ?? logSort[0].id;
    filtered.sort((a, b) => {
      switch (sortKey) {
        case 'author_asc':
        case 'author_desc': {
          const aa = getAuthor(a).toLowerCase();
          const bb = getAuthor(b).toLowerCase();
          return sortKey === 'author_asc' ? aa.localeCompare(bb) : bb.localeCompare(aa);
        }
        case 'date_asc':
        case 'date_desc':
        default: {
          const ta = getTs(a);
          const tb = getTs(b);
          return sortKey === 'date_asc' ? ta - tb : tb - ta;
        }
      }
    });

    return filtered;
  }, [logEntries, queryState.sort?.by, queryState.values]);

  // Button handler
  const handleOpenFilters = () => setFiltersOpen(true);

  return (
    <PageWrapper>
      <PageTitle
        title={incident?.type ? Format.incident.type(incident?.type) : ''}
        subtitle={incident?.name ?? ''}
        stage={incident?.stage}
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          {!adding && (
            <Button
              type="button"
              variant="contained"
              size={isMobile ? 'medium' : 'large'}
              startIcon={<AddCircleIcon />}
              onClick={onAddEntryClick}
            >
              Add log entry
            </Button>
          )}
        </Box>
      </PageTitle>

      {adding && (
        <AddEntry
          incident={incident}
          entries={logEntries ?? []}
          onCreateEntry={onAddEntry}
          onCancel={onCancel}
        />
      )}

      <Box display="flex" flexDirection="column" width="100%">
        {logEntries && logEntries.length > 0 ? (
          <>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              flexWrap="wrap"
              width="100%"
              mb="1.6rem"
              gap={1}
              displayPrint="none"
            >
              <Box display="flex" flexDirection="row" flexGrow={1} gap={2}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleOpenFilters}
                >
                  Sort & Filter
                </Button>
              </Box>
            </Box>

            {visibleEntries.length > 0 ? (
              <EntryList
                entries={visibleEntries}
                onContentClick={onContentClick}
                onMentionClick={onMentionClick}
              />
            ) : (
              <Box p={2} bgcolor="background.default">
                <Typography variant="h6">No results found.</Typography>
                <Typography mt={1}>Try adjusting your filters.</Typography>
              </Box>
            )}
          </>
        ) : (
          <Box p={2} bgcolor="background.default">
            <Typography variant="h6">No logs found.</Typography>
            <Typography mt={1}>There are currently no log entries.</Typography>
          </Box>
        )}
      </Box>

      <SortAndFilter
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sort={logSort}
        tree={logFilters}
        initial={queryState}
        onApply={(next) => {
          setQueryState(next);
          setFiltersOpen(false);
        }}
        onClear={() => {
          setQueryState({ values: {}, sort: { by: 'date_desc', direction: 'desc' } });
        }}
      />
    </PageWrapper>
  );
};

export default Logbook;
