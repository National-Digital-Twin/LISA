// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box } from "@mui/material";
import { PageTitle } from "../components";
import PageWrapper from "../components/PageWrapper";
import IntroWidget from '../components/Widgets/IntroWidget';
import TasksWidget from "../components/Widgets/TaskWidget";
import AlertsWidget from "../components/Widgets/AlertsWidget";

const Home = () => (
  <>
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        paddingX: { xs: '1rem', md: '60px' },
        paddingY: '1.3rem',
      }}
    >
      <PageTitle title="Summary" />
    </Box>

    <PageWrapper backgroundColor="#f7f7f7">
      <IntroWidget />
      <TasksWidget />
      <AlertsWidget />
    </PageWrapper>
  </>
);

export default Home;

