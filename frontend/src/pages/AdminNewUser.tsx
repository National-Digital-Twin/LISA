// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, TextField } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';

const AdminNewUser = () => (
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
        <PageTitle title="Invite new user (coming soon)" />
      </Box>
    </Box>

    <PageWrapper backgroundColor="#f7f7f7">
      <Box sx={{ width:'100%', px:{ xs:'1rem', md:'1' } }}>
        <Box sx={{ display:'grid', gap:2 }}>
          <TextField
            fullWidth
            type="email"
            placeholder="Email address"
            label="Email address"
            sx={{ backgroundColor:'white' }}
            slotProps={{ input:{ 'aria-label':'Email address' } }}
          />

          <Box sx={{ width:'100%', display:'flex', justifyContent:{ xs:'flex-start', md:'flex-end' } }}>
            <Button
              variant="contained"
              disabled
              startIcon={<SendOutlinedIcon />}
              sx={{ width:{ xs:'100%', md:'auto' } }}
            >
          Send invite
            </Button>
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  </>
)

export default AdminNewUser;
