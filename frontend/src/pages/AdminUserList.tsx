// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useMemo, useState } from 'react';
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import { useUsers } from '../hooks';
import { SortAndFilter } from '../components/SortFilter/SortAndFilter';
import { QueryState } from '../components/SortFilter/filter-types';
import { buildUserFilters, userSort } from '../components/SortFilter/schemas/user-schema';

const AdminUserList = () => {
  const { users } = useUsers()
  const navigate = useNavigate();

  const onAddUser= () => {
    navigate('/settings/users/new');
  };

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [queryState, setQueryState] = useState<QueryState>({
    values: {},
    sort: { by: 'displayName', direction: 'desc' }
  });

  const userFilters = useMemo(
    () => buildUserFilters(),
    []
  );

  const handleOpenFilters = () => setFiltersOpen(true);

  const visibleUsers = useMemo(() => {
    if (!users) return [];

    const filtered = users.filter(() => true);

    const sorted = [...filtered].sort((a, b) => {
      const key = queryState.sort?.by;
      switch (key) {
        case 'displayName_asc':
          return a.displayName.localeCompare(b.displayName);
        case 'displayName_desc':
          return b.displayName.localeCompare(a.displayName);
        default:
          return a.displayName.localeCompare(b.displayName);
      }
    });

    return sorted;
  }, [userFilters, users, queryState.sort?.by, queryState.values]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'white',
          paddingX: { xs: '1rem', md: '1' },
          paddingY: '1.3rem'
        }}
      >
        <Box
          component={Link}
          to="/settings"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'inherit',
            textDecoration: 'none',
            mr: 2
          }}
        >
          <ArrowBackIcon sx={{ marginRight: 1 }} />
          <PageTitle title="Manage users" />
        </Box>
      </Box>

      <PageWrapper>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button
            color="primary"
            startIcon={<AddCircleIcon />}
            variant="contained"
            sx={{
              flexBasis: { xs: '48%', md: 'auto' },
              flexGrow: { xs: 1, md: 0 }
            }}
            onClick={onAddUser}
          >
            Add new user
          </Button>
          <Button
            color="primary"
            variant="contained"
            sx={{
              flexBasis: { xs: '48%', md: 'auto' },
              flexGrow: { xs: 1, md: 0 }
            }}
            onClick={handleOpenFilters}
          >
            Sort & Filter
          </Button>
        </Box>

        <Paper elevation={0} sx={{ bgcolor: "#ededee", p: 1.5, borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Users
          </Typography>
        </Paper>

        {visibleUsers.map(user => (
          <Box sx={{ pl: 1, mb: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }} component={Link} to={`/settings/user-profile?user=${encodeURIComponent(user.email || '')}`}>
              {user.displayName}
            </Typography>
            <Box sx={{ color: 'secondary' }}>
              {user.email?.split('@')[1] || ''}
            </Box>
          </Box>
        ))}

        <SortAndFilter
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          sort={userSort}
          tree={userFilters}
          initial={queryState}
          onApply={(next) => {
            setQueryState(next);
            setFiltersOpen(false);
          }}
          onClear={() => {
            setQueryState({
              values: {},
              sort: { by: 'name_asc', direction: 'desc' }
            });
          }}
        />
      </PageWrapper>
    </>
  )
}

export default AdminUserList;
