// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Link } from 'react-router-dom'
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { PageTitle } from '../components'
import PageWrapper from '../components/PageWrapper'
import { isAdmin } from '../utils/userRoles'
import { useAuth } from '../hooks'

const Settings = () => {
  const { user } = useAuth()

  return (
    <PageWrapper>
      <PageTitle title="Settings" />
      <Box>
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

              <ListItemButton sx={{ pl: 0 }} component={Link} to="/">
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
      </Box>
    </PageWrapper>
  )
}

export default Settings