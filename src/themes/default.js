import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#000',
    },
    text: {
      primary: '#000',
    },
  },
  typography: {
    fontFamily: "'SBBWeb-Roman', 'Arial', 'sans-serif'",
    fontSize: 12,
    htmlFontSize: 14,
  },
  overrides: {
    MuiInputBase: {
      root: {
        fontSize: '1em',
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: '14px',
      },
    },
  },
});

export default theme;
