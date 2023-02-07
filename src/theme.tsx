import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#00809C',
    },
    secondary: {
      main: '#F0B179',
    },
    info: {
      main: '#30DBFF'
    },
    error: {
      main: '#9C4900'
    }
  },
});

export default theme;
