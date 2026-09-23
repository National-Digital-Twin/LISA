// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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
    chip: {
      main: string;
    }
    status: {
      todo: StageType;
      done: StageType;
      inprogress: StageType;
    };
    recording: {
      inactive: string;
      active: string;
      activeDark: string;
    };
    stage: {
      monitoring: StageType;
      response: StageType;
      recovery: StageType;
      closed: StageType;
    };
  }
}
