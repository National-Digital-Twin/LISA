// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useMemo, useState } from 'react';
import { visuallyHidden } from '@mui/utils';
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import { useUsers } from '../hooks';
import { SortAndFilter } from '../components/SortFilter/SortAndFilter';
import { QueryState } from '../components/SortFilter/filter-types';
import { buildUserFilters, userSort } from '../components/SortFilter/schemas/user-schema';

const AdminUserList = () => {
  const { users } = useUsers()
  const navigate = useNavigate();

  const onAddUser = () => {
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

    const v = queryState.values;
    const searchTerm = ((v.search as string) ?? '').trim().toLowerCase();

    const filtered = users.filter((user) => {
      if (!searchTerm) return true;
      if (user.email?.toLowerCase().includes(searchTerm)) return true;
      if (user.displayName?.toLowerCase().includes(searchTerm)) return true;
      return false;
    });

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
  }, [users, queryState.sort?.by, queryState.values]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'white',
          paddingX: { xs: '1rem', md: '60px' },
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

        <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={visuallyHidden}>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleUsers.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600 }}
                      component={Link}
                      to={`/settings/user-profile?user=${encodeURIComponent(user.email || '')}`}
                    >
                      {user.displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email?.split('@')[1] || ''}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
        />
      </PageWrapper>
    </>
  )
}

export default AdminUserList;
