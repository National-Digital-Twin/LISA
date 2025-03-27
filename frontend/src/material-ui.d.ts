// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import '@mui/material/styles/createPalette';

type StageType = { primary: string; secondary: string };

declare module '@mui/material/styles/createPalette' {
  export interface PaletteOptions {
    accent: {
      main: string;
    };
    border: {
      main: string;
    };
    stage: {
      monitoring: StageType;
      response: StageType;
      recovery: StageType;
      closed: StageType;
    };
  }
}
