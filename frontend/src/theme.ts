import { createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'white'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#f0f2f2'
          }
        }
      }
    }
  },
  typography: {
    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(',')
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1051,
      lg: 1200,
      xl: 1536
    }
  },
  palette: {
    primary: {
      main: '#3670b3' /* primary-color */
    },
    secondary: {
      main: '#002244' /* secondary-color */
    },
    background: {
      default: '#f0f2f2' /* off-white */
    },
    text: {
      primary: '#0e142b' /* deep-navy */
    },
    error: {
      main: '#bd0000'
    },
    accent: {
      main: '#ffcf06'
    },
    border: {
      main: '#c2c2c2'
    },
    stage: {
      monitoring: {
        primary: '#ffd324',
        secondary: '#f7edc4'
      },
      response: {
        primary: '#eb2626',
        secondary: '#f69d9d'
      },
      recovery: {
        primary: '#d350a7',
        secondary: '#e79dce'
      },
      closed: {
        secondary: '#ffffff',
        primary: '#c2c2c2'
      }
    }
  }
});

export default theme;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
