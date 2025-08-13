// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Card, CardContent, Divider, List, ListItemButton, ListItemText } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Link } from 'react-router-dom';
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../hooks';
import { isAdmin } from '../utils/userRoles';

const Settings = () => {
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
          <PageTitle title="Settings" />
        </Box>
      </Box>

      <PageWrapper backgroundColor="#f7f7f7">
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <List disablePadding>
              <ListItemButton sx={{ pl: 0 }} component={Link} to="/settings/my-profile">
                <ListItemText primary="Manage my profile" />
                <ChevronRightIcon />
              </ListItemButton>
              <Divider />

              {isAdmin(user.current) && (
                <>
                  <ListItemButton sx={{ pl: 0 }} component={Link} to="/settings/users">
                    <ListItemText primary="Manage users" />
                    <ChevronRightIcon />
                  </ListItemButton>
                  <Divider />

                  <ListItemButton sx={{ pl: 0 }} component={Link} to="/incidents">
                    <ListItemText primary="Manage incidents" />
                    <ChevronRightIcon />
                  </ListItemButton>
                  <Divider />
                </>
              )}

              <ListItemButton sx={{ pl: 0 }} disabled>
                <ListItemText primary="Manage notifications (coming soon)" />
              </ListItemButton>
              <Divider />

              <ListItemButton sx={{ pl: 0 }} disabled>
                <ListItemText primary="Send feedback (coming soon)" />
              </ListItemButton>
              <Divider />

              <ListItemButton sx={{ pl: 0 }} disabled>
                <ListItemText primary="Privacy notice (coming soon)" />
              </ListItemButton>
            </List>
          </CardContent>
        </Card>
      </PageWrapper>
    </>
  )
}


export default Settings;
