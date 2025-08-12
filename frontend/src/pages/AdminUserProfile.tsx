// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Card, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useSearchParams } from 'react-router-dom';
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import { useUsers } from '../hooks';

const AdminUserProfile = () => {
  const { users } = useUsers()
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get('user');

  const selectedUser = Array.isArray(users)
    ? users.find(u => String(u.email) === String(userEmail))
    : null;

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
          to="/settings/users"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'inherit',
            textDecoration: 'none',
            mr: 2
          }}
        >
          <ArrowBackIcon sx={{ marginRight: 1 }} />
          <PageTitle title={selectedUser?.displayName ?? 'Unknown user'} />
        </Box>
      </Box>

      <PageWrapper backgroundColor="#f7f7f7">
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <Box sx={{ padding: 3 }}>
            <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 500, paddingBottom: 2 }}>
              Personal details
            </Typography>
            <Typography variant="body1" gutterBottom>
              <span style={{ fontWeight: 'bold' }}>Organisation:</span>{' '}
              {selectedUser?.email?.split('@')[1] || ''}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <span style={{ fontWeight: 'bold' }}>Email:</span>{' '}
              {selectedUser?.email || 'Not provided'}
            </Typography>
          </Box>
        </Card>
      </PageWrapper>
    </>
  );
};

export default AdminUserProfile;