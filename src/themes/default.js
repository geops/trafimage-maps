import { createTheme } from '@material-ui/core/styles';

const breakpointValues = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const theme = createTheme({
  breakpoints: { values: breakpointValues },
  palette: {
    primary: {
      main: '#000',
    },
    secondary: {
      main: '#eb0000',
      dark: '#c60018',
    },
    text: {
      primary: '#000',
    },
  },
  typography: {
    fontFamily: "'SBBWeb-Roman', 'Arial', 'sans-serif'",
    fontSize: 12,
    htmlFontSize: 14, // SBB design says 15
    h4: {
      fontFamily: "'SBBWeb-Bold', 'Arial', 'sans-serif'",
      fontWeight: 'bold',
      fontSize: '1em',
      lineHeight: '22.5px',
    },
    body1: {
      fontSize: '1em',
      fontWeight: 'normal',
      lineHeight: '19.5px',
      color: '#000000',
    },
    subtitle1: {
      fontSize: 13,
      lineHeight: '19.5px',
      color: '#767676',
    },
    button: {
      fontSize: '1em',
      letterSpacing: 0,
      lineHeight: '26px',
    },
  },
  spacing: (value) => {
    let space = 0;
    switch (value) {
      case 'thin':
        space = 8; // From SSB design
        break;
      case 'small':
        space = 24; // From SSB design
        break;
      case 'medium':
        space = 48; // From SSB design
        break;
      default:
        space = value * 8;
        break;
    }
    return space;
  },
  props: {
    MuiPopover: {
      elevation: 0,
    },
    MuiIconButton: {
      size: 'small',
      disableRipple: true,
      disableFocusRipple: true,
    },
    MuiButton: {
      variant: 'contained',
      color: 'primary',
      disableRipple: true,
      disableFocusRipple: true,
      disableElevation: true,
    },
    MuiToggleButton: {
      disableRipple: true,
      disableFocusRipple: true,
    },
    MuiMenuItem: {
      disableRipple: true,
    },
    MuiTab: {
      disableRipple: true,
      disableFocusRipple: true,
    },
    MuiMenu: {
      transitionDuration: 0,
    },
  },
  overrides: {
    MuiSelect: {
      icon: {
        transition: 'transform 400ms',
        color: 'inherit',
        width: 18,
      },
    },
    MuiPopover: {
      paper: {
        border: '2px solid #666',
        padding: '30px 20px',
        overflowX: 'visible',
        overflowY: 'visible',
        maxWidth: 400,
        '& .MuiIconButton-root.wkp-close': {
          position: 'absolute',
          border: 'none',
          right: 0,
          top: 0,
          color: 'black',
          height: '50px',
          width: '50px',
          // SBB design
          // float: 'right',
          // width: 25,
          // height: 25,
          // padding: 0,
          // color: 'lightgray',
          // '& svg': {
          //   width: '100%',
          //   height: '100%',
          // },
        },
        '& .wkp-arrow-center-left': {
          position: 'absolute',
          top: 'calc(50% - 11px)',
          left: -12,
          width: 20,
          height: 20,
          border: '2px solid #666',
          borderWidth: '0 2px 2px 0',
          display: 'inline-block',
          transform: 'rotate(135deg)',
          background: 'white',
        },
        // Remove the padding for menu or select
        '&.MuiMenu-paper': {
          padding: 0,
        },
      },
    },
    // This css was done for IconButton as child of the ToggleButton.
    // maybe there will be more use case to manage in the future.
    MuiToggleButton: {
      root: {
        border: 'none',
        padding: 0,
        '&:hover, &$selected': {
          backgroundColor: 'transparent',
        },
        '&$selected svg': {
          color: '#eb0000',
        },
      },
    },
    MuiInputBase: {
      root: {
        borderRadius: 2,
        fontSize: '1em',
      },
    },
    MuiOutlinedInput: {
      root: {
        borderWidth: 1,
        boxSizing: 'border-box',
        '& $notchedOutline': {
          borderColor: '#888',
          borderWidth: 1,
        },
        '&:hover $notchedOutline': {
          borderColor: '#888',
          borderWidth: 1,
        },
        '&$focused $notchedOutline': {
          borderColor: '#888',
          borderWidth: 1,
        },
      },
      focused: {},
      notchedOutline: {},
    },
    MuiMenuItem: {
      root: {
        fontSize: '14px',
        '&:hover,&:focus': {
          color: '#eb0000',
          backgroundColor: 'white',
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: '2px',
        minWidth: 60,
        maxWidth: 400,
        height: 48,
        textTransform: 'none',
        transition: 'none',
        borderWidth: '1px',
        paddingLeft: 40,
        paddingRight: 40,

        '&$disabled': {
          color: '#666',
          borderColor: '#979797',
          textDecoration: 'line-through',
          backgroundColor: 'white',
        },
      },
      containedPrimary: {
        color: '#fff',
        backgroundColor: '#eb0000',
        borderColor: '#eb0000',
        '&:hover': {
          borderColor: '#c60018',
          backgroundColor: '#c60018',
        },
      },
      containedSecondary: {
        color: '#000',
        backgroundColor: '#dcdcdc',
        borderColor: '#dcdcdc',
        '&:hover': {
          borderColor: '#cdcdcd',
          backgroundColor: '#cdcdcd',
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
    MuiDialog: {
      paper: {
        pointerEvents: 'auto',
        textAlign: 'left',
        minHeight: 65,
        backgroundColor: '#fff',
        overflowY: 'hidden',
        borderRadius: 0,
        margin: 0,
        width: 'min-content',
      },
      paperWidthFalse: {
        maxWidth: 'none',
      },
    },
    MuiDialogTitle: {
      root: {
        fontSize: 14,
        borderBottom: '1px solid #eee',
        height: 50,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
      },
    },
  },
});

export default theme;
