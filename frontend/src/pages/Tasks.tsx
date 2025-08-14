// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Task, TaskStatus } from 'common/Task';
import DataList, { ListRow } from '../components/DataList';
import { useIncidents, useAllTasks, useAuth } from '../hooks';
import { Format } from '../utils';

import { SortAndFilter } from '../components/SortFilter/SortAndFilter';
import { buildTaskFilters, taskSort } from '../components/SortFilter/schemas/task-schema';
import { type QueryState } from '../components/SortFilter/filter-types';
import { countActive } from '../components/SortFilter/filter-utils';
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';

function StatusDot({ status }: Readonly<{ status: TaskStatus }>) {
  let color: string;
  let borderColor: string;

  if (status === 'Done') {
    color = '#9DF5A8';
    borderColor = '#239932';
  } else if (status === 'InProgress') {
    color = '#F5CF9D';
    borderColor = '#FF6D24';
  } else {
    color = '#A5D3F5';
    borderColor = '#3C3DE9';
  }

  return (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: color,
        border: '1px solid',
        borderColor,
        flexShrink: 0
      }}
    />
  );
}

const DEFAULT_QUERY_STATE: QueryState = {
  values: {
    status: ['ToDo', 'InProgress'] // Default to show only active tasks
  },
  sort: { by: 'date_desc', direction: 'desc' }
};

export default function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: incidents } = useIncidents();
  const { data: tasksData } = useAllTasks();
  const [searchParams] = useSearchParams();

  const mine = searchParams.get('mine') === 'true';
  const status = searchParams.get('status');

  const initialValues: QueryState['values'] = {
    ...DEFAULT_QUERY_STATE.values
  };

  if (mine && user?.current?.username) {
    initialValues.assignee = [user.current?.username];
  }
  
  if (status) {
    initialValues.status = [status];
  }

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [queryState, setQueryState] = useState<QueryState>({
    values: initialValues,
    sort: DEFAULT_QUERY_STATE.sort
  });

  const allTasks: Task[] = useMemo(() => tasksData ?? [], [tasksData]);
  const incidentNameById = new Map((incidents ?? []).map((i) => [i.id, i.name] as const));

  const allAuthors = useMemo(() => {
    const seen = new Set<string>();
    return allTasks
      .map((t) => t.author)
      .filter((user) => {
        if (!user || seen.has(user.username)) return false;
        seen.add(user.username);
        return true;
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [allTasks]);

  const allAssignees = useMemo(() => {
    const seen = new Set<string>();
    return allTasks
      .map((t) => t.assignee)
      .filter((user) => {
        if (!user || seen.has(user.username)) return false;
        seen.add(user.username);
        return true;
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [allTasks]);

  const taskFilters = useMemo(() => {
    const incidentList = (incidents ?? []).map((i) => ({ id: i.id, name: i.name }));
    return buildTaskFilters(allAuthors, allAssignees, incidentList);
  }, [allAuthors, allAssignees, incidents]);

  const visibleTasks = useMemo(() => {
    const items = allTasks.slice();
    const v = queryState.values;

    const searchTerm = ((v.search as string) ?? '').trim().toLowerCase();
    const selectedAuthors = new Set<string>((v.author as string[]) ?? []);
    const selectedAssignees = new Set<string>((v.assignee as string[]) ?? []);
    const selectedIncidents = new Set<string>((v.incident as string[]) ?? []);
    const selectedStatuses = new Set<string>((v.status as string[]) ?? []);

    const filtered = items.filter((task) => {
      if (searchTerm && (!task.name?.toLowerCase().includes(searchTerm) || !task.description?.toLowerCase().includes(searchTerm))) return false;

      if (selectedAuthors.size > 0) {
        if (!selectedAuthors.has(task.author.username)) return false;
      }

      if (selectedAssignees.size > 0) {
        if (!selectedAssignees.has(task.assignee.username)) return false;
      }

      if (selectedIncidents.size > 0) {
        if (!selectedIncidents.has(task.incidentId)) return false;
      }

      if (selectedStatuses.size > 0) {
        if (!selectedStatuses.has(task.status)) return false;
      }

      return true;
    });

    const sortBy = queryState.sort?.by || 'date_desc';
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'author_asc':
          return a.author.displayName.localeCompare(b.author.displayName);
        case 'author_desc':
          return b.author.displayName.localeCompare(a.author.displayName);
        case 'date_asc':
          return a.createdAt.localeCompare(b.createdAt);
        case 'date_desc':
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });

    return filtered;
  }, [allTasks, queryState]);

  const activeFilterCount = useMemo(() => countActive(queryState.values), [queryState.values]);

  const onAddTask = () => {
    navigate('/incidents/pick?next=/tasks/create/:incidentId');
  };

  const handleOpenFilters = () => setFiltersOpen(true);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'white',
          paddingX: { xs: '1rem', md: '60px' },
          paddingY: '1.3rem'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'inherit',
            textDecoration: 'none',
            mr: 2
          }}
        >
          <PageTitle title="Tasks" />
        </Box>
      </Box>

      <PageWrapper backgroundColor="#f7f7f7">
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'flex-end' // added
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={onAddTask}
            color="primary"
            sx={{
              flex: { xs: 1, sm: '0 0 auto' },
              maxWidth: { sm: '200px' }
            }}
          >
            Add Task
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenFilters}
            color="primary"
            sx={{
              flex: { xs: 1, sm: '0 0 auto' },
              maxWidth: { sm: '200px' }
            }}
          >
            Sort & Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'background.default',
            p: { xs: 0, md: 0 }
          }}
        >
          {visibleTasks.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                padding: 4,
                flexDirection: 'column',
                alignItems: 'center',
                color: 'text.secondary'
              }}
            >
              <Typography variant="h6">
                {allTasks.length === 0 ? 'No tasks found' : 'No results found'}
              </Typography>
              <Typography variant="body2">
                {allTasks.length === 0
                  ? 'There are currently no tasks.'
                  : 'There are no tasks matching your filters.'}
              </Typography>
            </Box>
          ) : (
            <DataList
              items={visibleTasks.map<ListRow>((t) => ({
                key: t.id,
                title: t.name,
                content: (
                  <Typography variant="body2">Assigned to: {Format.user(t.assignee)}</Typography>
                ),
                footer: `INCIDENT: ${incidentNameById.get(t.incidentId) ?? t.incidentId}`,
                titleDot: <StatusDot status={t.status} />,
                onClick: () => navigate(`/tasks/${t.incidentId}#${t.id}`)
              }))}
            />
          )}
        </Box>

        <SortAndFilter
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          sort={taskSort}
          tree={taskFilters}
          initial={queryState}
          onApply={(next) => {
            setQueryState(next);
            setFiltersOpen(false);
          }}
        />
      </PageWrapper>
    </Box>
  );
}
