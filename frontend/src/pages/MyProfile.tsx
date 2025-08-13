// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, Card, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../hooks';

const MyProfile = () => {
  const { user } = useAuth()

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
          <PageTitle title={user.current?.displayName ?? "Unknown user"} />
        </Box>
      </Box>

      <PageWrapper backgroundColor="#f7f7f7">
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <Box sx={{ padding: 3 }}>
            <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 500, paddingBottom: 2 }}>
              Personal details
            </Typography>
            <Typography variant="body2" gutterBottom>
              <span style={{ fontWeight: 'bold' }}>Organisation:</span>{' '}
              {user.current?.email?.split('@')[1] || ''}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <span style={{ fontWeight: 'bold' }}>Email:</span>{' '}
              {user.current?.email || 'Not provided'}
            </Typography>
          </Box>
        </Card>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'stretch', md: 'flex-end' }
          }}
        >
          <Button
            variant="contained"
            disabled
            sx={{ width: { xs: '100%', md: 'auto' } }}
          >
            Edit details
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, textAlign: { xs: 'left', md: 'right' } }}
          >
            (coming soon)
          </Typography>
        </Box>
      </PageWrapper>
    </>
  )
}


export default MyProfile;
