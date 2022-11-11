import { createTheme } from '@material-ui/core/styles';

const colors = {
  red: '#eb0000',
  redDark: '#c60018',
  black: '#000',
  gray: '#767676',
  lightgray: '#b7b7b7',
};

const breakpointValues = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const typoBody = {
  fontSize: 14,
  fontWeight: 'normal',
  lineHeight: '16.8px',
  color: '#000000',
};

const theme = createTheme({
  breakpoints: { values: breakpointValues },
  palette: {
    primary: {
      main: colors.black,
    },
    secondary: {
      main: colors.red,
      dark: colors.redDark,
    },
    text: {
      primary: colors.black,
      secondary: colors.gray,
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
    body1: typoBody,
    body2: {
      ...typoBody,
      fontSize: 16,
    },
    subtitle1: {
      fontSize: 13,
      lineHeight: '19.5px',
      color: colors.gray,
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
    MuiListItemText: {
      primaryTypographyProps: { variant: 'body1' },
    },
  },
  overrides: {
    // from sbb design, see 'select' angular components
    MuiSelect: {
      select: {
        '&:focus': {
          backgroundColor: 'white',
        },
      },
      icon: {
        transition: 'transform 400ms',
        width: 18,
        color: 'inherit', // on SBB design it will be more colors.gray, but it's nicer like this.
      },
      outlined: {
        padding: '10px 44px 11px 14px',
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
          color: colors.red,
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
      notchedOutline: {
        borderRadius: 2,
        borderWidth: 2,
        borderColor: colors.lightgray,
      },
      root: {
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.lightgray,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#666',
        },
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: '14px',
        '&:hover,&:focus': {
          color: colors.redDark,
          backgroundColor: 'white !important',
        },
        paddingLeft: 14,
      },
    },
    MuiListItem: {
      root: {
        backgroundColor: 'white !important',
        '&:hover': {
          backgroundColor: 'white !important',
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
        backgroundColor: colors.red,
        borderColor: colors.red,
        '&:hover': {
          borderColor: colors.redDark,
          backgroundColor: colors.redDark,
        },
      },
      containedSecondary: {
        color: colors.black,
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
        borderRadius: 0,
        color: colors.black,
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
      root: {
        position: 'absolute !important',
      },
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
        minHeight: 50,
        height: 'auto',
        padding: '0 40px 0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
      },
    },
  },
});

export default theme;
