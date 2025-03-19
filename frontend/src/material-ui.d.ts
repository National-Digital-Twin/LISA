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
