// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Typography } from '@mui/material';
import PageWrapper from '../components/PageWrapper';

const Dashboard = () => (
  <PageWrapper>
    <Box sx={{ padding: 3, textAlign: 'center' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Page is under development and will be available soon.
      </Typography>
    </Box>
  </PageWrapper>
);

export default Dashboard;
