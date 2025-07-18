// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, InputAdornment, Popover, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type Mentionable, type MentionableType } from 'common/Mentionable';
import { AddEntry, EntryList, Filter, PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import {
  useAuth,
  useCreateLogEntry,
  useIncidents,
  useLogEntries,
  useLogEntriesUpdates
} from '../hooks';
import { Format, Search as SearchUtil } from '../utils';
import { type OnCreateEntry } from '../utils/handlers';
import { type FieldValueType, type FilterType, type SpanType } from '../utils/types';
import { useResponsive } from '../hooks/useResponsiveHook';

const Logbook = () => {
  const { incidentId } = useParams();
  const query = useIncidents();
  const { logEntries } = useLogEntries(incidentId);
  const { createLogEntry } = useCreateLogEntry(incidentId);
  const { user } = useAuth();
  const [adding, setAdding] = useState<boolean>(false);
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterType>({ author: [], category: [] });
  const [searchText, setSearchText] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openFilters = Boolean(anchorEl);
  const { isMobile } = useResponsive();
  const navigate = useNavigate();

  const handleOpenFilters = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  useEffect(() => {
    const preventRefresh = (ev: BeforeUnloadEvent) => {
      const lastEntry = logEntries?.at(-1);
      const hasOffline = lastEntry?.offline === true;

      if (hasOffline || adding) {
        ev.preventDefault();
      }
    };

    window.addEventListener('beforeunload', preventRefresh);

    return () => {
      window.removeEventListener('beforeunload', preventRefresh);
    };
  }, [adding, logEntries]);

  useLogEntriesUpdates(incidentId ?? '');

  const incident = query?.data?.find((inc) => inc.id === incidentId);
  const filterAuthors = Format.incident.authors(user.current, logEntries);
  const filterCategories = Format.incident.categories(logEntries);

  const onSort = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setSortAsc((prev) => !prev);
  };

  const onCancel = () => {
    document.documentElement.scrollTo(0, 0);
    setAdding(false);
  };

  const onAddEntryClick = () => {
    navigate('#');
    setAdding(true);
  };

  const onAddEntry: OnCreateEntry = (_entry, files) => {
    createLogEntry({ logEntry: _entry, attachments: files });
    setTimeout(() => {
      setAdding(false);
      document.documentElement.scrollTo(0, 0);
    }, 500);
    return undefined;
  };

  const onMentionClick = (mention: Mentionable) => {
    if (mention.type === 'User') {
      console.log(`Clicked on user ${mention.id}:`, mention.label);
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
        label: target.textContent ?? ''
      });
    } else if (target.tagName !== 'A') {
      navigate('#');
    }
  };

  const onFilterChange = (id: string, value: FieldValueType) => {
    setAppliedFilters((prev) => ({ ...prev, [id]: value }));
  };

  const onSearch = (value: string) => {
    setSearchText(value.trim());
  };

  const filterEntries = (e: LogEntry): boolean => SearchUtil.entries(e, appliedFilters, searchText);

  const sortIcon = () => {
    const style = { transform: sortAsc ? 'rotate(180deg)' : 'rotate(0deg)' };
    return isMobile ? <ArrowUpwardIcon sx={style} /> : <KeyboardArrowUpIcon sx={style} />;
  };

  return (
    <PageWrapper>
      <PageTitle
        title={incident?.type ? Format.incident.type(incident?.type) : ''}
        subtitle={incident?.name ?? ''}
        stage={incident?.stage}
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          {isMobile && !adding && (
            <Button variant="text" onClick={onSort} endIcon={sortIcon()} color="secondary">
              Sort
            </Button>
          )}
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
        {logEntries !== undefined && logEntries.length > 0 ? (
          <>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              flexWrap="wrap"
              width="100%"
              component="form"
              mb="1.6rem"
              gap={1}
              displayPrint="none"
            >
              <Box display="flex" flexDirection="row" flexGrow={1} gap={2}>
                <TextField
                  size={isMobile ? 'small' : 'medium'}
                  fullWidth={isMobile}
                  id="search-bar"
                  variant="outlined"
                  label="Search"
                  placeholder="Search..."
                  onChange={(e) => onSearch(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon color="primary" />
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{ minWidth: '30%' }}
                />
                {!isMobile ? (
                  <Filter
                    isMobile={isMobile}
                    appliedFilters={appliedFilters}
                    onChange={onFilterChange}
                    filters={[
                      {
                        id: 'author',
                        label: 'Author',
                        hintText: 'Everyone',
                        type: 'multiselect',
                        options: filterAuthors
                      },
                      {
                        id: 'category',
                        label: 'Category',
                        type: 'multiselect',
                        options: filterCategories
                      }
                    ]}
                  />
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      color="secondary"
                      endIcon={<FilterAltIcon color={anchorEl ? 'primary' : 'secondary'} />}
                      onClick={handleOpenFilters}
                    >
                      Filter
                    </Button>

                    <Popover
                      open={openFilters}
                      anchorEl={anchorEl}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                      }}
                      transformOrigin={{
                        vertical: -10,
                        horizontal: 'left'
                      }}
                      slotProps={{
                        paper: {
                          sx: {
                            width: '100%',
                            padding: '1rem',
                            borderRadius: 0
                          }
                        }
                      }}
                    >
                      <Box display="flex" flexDirection="column" gap={1} width="100%">
                        <Filter
                          isMobile={isMobile}
                          appliedFilters={appliedFilters}
                          onChange={onFilterChange}
                          filters={[
                            {
                              id: 'author',
                              label: 'Author',
                              hintText: 'Everyone',
                              type: 'multiselect',
                              options: filterAuthors
                            },
                            {
                              id: 'category',
                              label: 'Category',
                              hintText: 'Any',
                              type: 'multiselect',
                              options: filterCategories
                            }
                          ]}
                        />
                      </Box>
                    </Popover>
                  </>
                )}
              </Box>
              {!isMobile && (
                <Box display="flex" width="auto" alignItems="center">
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={onSort}
                    color="secondary"
                    endIcon={sortIcon()}
                  >
                    <Typography fontWeight="bold" color="text.primary">
                      MOST RECENT AT
                      <Typography fontWeight="bold" component="span" color="primary">
                        {sortAsc ? ' BOTTOM' : ' TOP'}
                      </Typography>
                    </Typography>
                  </Button>
                </Box>
              )}
            </Box>
            {(logEntries ?? []).filter(filterEntries).length > 0 ? (
              <EntryList
                entries={(logEntries ?? []).filter(filterEntries)}
                sortAsc={sortAsc}
                onContentClick={onContentClick}
                onMentionClick={onMentionClick}
              />
            ) : (
              <Box p={2} bgcolor="background.default">
                <Typography variant="h6">No results found.</Typography>
                <Typography mt={1}>Try adjusting your filters to see more log entries.</Typography>
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
    </PageWrapper>
  );
};

export default Logbook;
