// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, Menu, MenuItem, Typography, Divider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../components';
import PageWrapper from '../components/PageWrapper';
import AlertsWidget from '../components/Widgets/AlertsWidget';
import IntroWidget from '../components/Widgets/IntroWidget';
import TasksWidget from '../components/Widgets/TaskWidget';
import { useMenu } from '../hooks';

const Home = () => {
  const navigate = useNavigate();
  const addMenu = useMenu();

  const handleAddTask = () => {
    addMenu.handleClose();
    navigate('/incidents/pick?next=/tasks/create/:incidentId');
  };

  const handleAddEntry = () => {
    addMenu.handleClose();
    navigate('/incidents/pick?next=/logbook/:incidentId?add=entry');
  };

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
        <PageTitle title="Summary"
          subtitleComponent={
            <Button
              type="button"
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={addMenu.handleOpen}
            >
              Add new
            </Button>
          }
        />
      </Box>

      <PageWrapper backgroundColor="#f7f7f7">
        <IntroWidget />
        <TasksWidget />
        <AlertsWidget />
      </PageWrapper>

      <Menu
        anchorEl={addMenu.anchorEl}
        open={addMenu.open}
        onClose={addMenu.handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 200
            }
          }
        }}
      >
        <MenuItem onClick={handleAddEntry}>
          <Typography sx={{ fontWeight: 'bold' }}>ENTRY</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleAddTask}>
          <Typography sx={{ fontWeight: 'bold' }}>TASK</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default Home;
