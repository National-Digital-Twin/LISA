// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Typography } from '@mui/material';
import WidgetBase from './WidgetBase';

const IntroWidget = () => (
  <WidgetBase title="Welcome to L!SA">
    <Typography variant="body2" gutterBottom>
        This is your central hub for managing incidents, tasks, and updates - all in one place.
    </Typography>
    <Typography variant="body2" >
        The new dashboard is on its way and will make it even easier to stay on top of what matters.
    </Typography>
  </WidgetBase>
);

export default IntroWidget;
