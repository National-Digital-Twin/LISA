// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import { useUsers } from '../hooks';

const AdminListUsers = () => {
  const { users } = useUsers()

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
          >
                        Sort & Filter
          </Button>
        </Box>

        <Paper elevation={0} sx={{ bgcolor: "#ededee", p: 1.5, mb: 1, borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Users
          </Typography>
        </Paper>


        {Array.isArray(users) && users.map(user => (
          <Box>
            <Box component={Link} to={`/settings/user-profile?user=${encodeURIComponent(user.email || '')}`}>
              {user.displayName}
            </Box>
            <Box sx={{ color: 'secondary' }}>
              {user.email?.split('@')[1] || ''}
            </Box>
          </Box>
        ))}
      </PageWrapper>
    </>
  )
}

export default AdminListUsers;
