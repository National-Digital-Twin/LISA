import { createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(',')
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
      primary: '#0e142b' /* deep-navy */,
      secondary: '#ffcf06' /* accent-yellow */
    },
    error: {
      main: '#bd0000'
    }
  }
});

export default theme;
