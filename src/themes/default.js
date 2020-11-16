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
    caption: {
      color: '#888',
    },
  },
  props: {
    MuiIconButton: {
      size: 'small',
      disableRipple: true,
      disableFocusRipple: true,
      disableElevation: true,
    },
    MuiButton: {
      variant: 'contained',
      color: 'primary',
      disableRipple: true,
      disableFocusRipple: true,
      disableElevation: true,
    },
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
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: '1px',
        minWidth: 60,
        maxWidth: 400,
        height: 40,
        transition: 'none',

        '&$disabled': {
          border: '1px solid darkgray',
          textDecoration: 'line-through',
        },
      },
      containedPrimary: {
        color: '#fff',
        backgroundColor: '#eb0000',
        '&:hover': {
          backgroundColor: '#c60018',
        },
        '&$disabled': {
          border: '1px solid darkgray',
          textDecoration: 'line-through',
        },
      },
      containedSecondary: {
        color: '#000',
        backgroundColor: 'lightgray',
        '&:hover': {
          backgroundColor: 'gray',
        },
      },
    },
    MuiIconButton: {
      root: {
        color: '#000',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&$disabled': {
          color: '#888',
        },
      },
      sizeSmall: {
        padding: 15,
      },
    },
  },
});

export default theme;
