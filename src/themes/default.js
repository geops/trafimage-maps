import React from "react";
import { createTheme } from "@mui/material/styles";
import CheckboxIcon from "../components/CheckboxIcon";

const colors = {
  red: "#eb0000",
  redDark: "#c60018",
  black: "#000",
  darkGray: "#444",
  gray: "#767676",
  lighterGray: "#b7b7b7",
  lightGray: "#e5e5e5",
};

const styles = {
  bottomFade: {
    "&::after": {
      content: '""',
      position: "absolute",
      zIndex: 10,
      bottom: -5,
      left: 0,
      pointerEvents: "none",
      backgroundImage:
        "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255, 1) 90%)",
      width: "calc(100% - 6px)",
      height: "5em",
    },
  },
};

const breakpoints = {
  values: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
};

const typoBody = {
  fontSize: 14,
  fontWeight: "normal",
  lineHeight: "16.8px",
  color: "#000000",
};

const themeSpacing = (value) => {
  let space = 0;
  switch (value) {
    case "thin":
      space = 8; // From SSB design
      break;
    case "small":
      space = 24; // From SSB design
      break;
    case "medium":
      space = 48; // From SSB design
      break;
    default:
      space = value * 8;
      break;
  }
  return space;
};

const v5 = {
  animations: {
    "@keyframes fadeInOut": {
      "0%": { opacity: 0 },
      "50%": { opacity: 1 },
      "100%": { opacity: 0 },
    },
  },
  colors,
  styles,
  breakpoints,
  mixins: {},
  spacing: themeSpacing,
  palette: {
    mode: "light",
    type: "light",
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
    htmlFontSize: 14,
    h4: {
      fontFamily: "'SBBWeb-Bold', 'Arial', 'sans-serif'",
      fontWeight: "bold",
      fontSize: "1em",
      lineHeight: "22.5px",
    },
    body1: typoBody,
    body2: {
      ...typoBody,
      fontSize: 16,
      lineHeight: "1.7333333rem",
    },
    subtitle1: {
      fontSize: 13,
      lineHeight: "19.5px",
      color: colors.gray,
    },
    button: {
      fontSize: "1em",
      letterSpacing: 0,
      lineHeight: "26px",
    },
  },
  components: {
    MuiCheckbox: {
      defaultProps: {
        icon: <CheckboxIcon />,
        checkedIcon: <CheckboxIcon checked />,
        disableRipple: true,
      },
    },
    MuiPopover: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        paper: {
          border: "2px solid #666",
          padding: "30px 20px",
          overflowX: "visible",
          overflowY: "visible",
          maxWidth: 400,
          "& .MuiIconButton-root.wkp-close": {
            position: "absolute",
            border: "none",
            right: 0,
            top: 0,
            color: "black",
            height: "50px",
            width: "50px",
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
          "& .wkp-arrow-center-left": {
            position: "absolute",
            top: "calc(50% - 11px)",
            left: -12,
            width: 20,
            height: 20,
            border: "2px solid #666",
            borderWidth: "0 2px 2px 0",
            display: "inline-block",
            transform: "rotate(135deg)",
            background: "white",
          },
          // Remove the padding for menu or select
          "&.MuiMenu-paper": {
            padding: 0,
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
        disableRipple: true,
        disableFocusRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          color: colors.black,
          "&:hover": {
            backgroundColor: "transparent",
            color: colors.redDark,
          },
          "&$disabled": {
            color: "#888",
          },
        },
        sizeSmall: {
          padding: 15,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
        disableRipple: true,
        disableFocusRipple: true,
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: "2px",
          minWidth: 60,
          maxWidth: 400,
          height: 48,
          textTransform: "none",
          transition: "none",
          borderWidth: "1px",
          paddingLeft: 40,
          paddingRight: 40,
          "&$disabled": {
            color: "#666",
            borderColor: "#979797",
            textDecoration: "line-through",
            backgroundColor: "white",
          },
        },
        containedPrimary: {
          color: "#fff",
          backgroundColor: colors.red,
          borderColor: colors.red,
          "&:hover": {
            borderColor: colors.redDark,
            backgroundColor: colors.redDark,
          },
        },
        containedSecondary: {
          color: colors.black,
          backgroundColor: "#dcdcdc",
          borderColor: "#dcdcdc",
          "&:hover": {
            borderColor: "#cdcdcd",
            backgroundColor: "#cdcdcd",
          },
        },
      },
    },
    MuiToggleButton: {
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
      },
      styleOverrides: {
        root: {
          border: "0",
          padding: 0,
          color: colors.black,
          "&:hover, &.Mui-selected:hover": {
            backgroundColor: "transparent",
            color: colors.redDark,
          },
          "&.Mui-selected": {
            backgroundColor: "transparent",
            color: colors.redDark,
          },
          "&.Mui-disabled": {
            color: "#888",
            border: "0",
          },
        },
      },
    },
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          color: colors.gray,
          "&:hover,&:focus": {
            color: colors.redDark,
          },
          paddingLeft: 14,
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
      },
      styleOverrides: {
        root: {
          lineHeight: "unset",
          minWidth: 0,
          marginLeft: 2,
          marginRight: 2,
          marginBottom: -1,
          border: "1px solid #dddddd",
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          textTransform: "none",
          "&:first-child": {
            marginLeft: themeSpacing(2),
          },
          "&:last-child": {
            marginRight: themeSpacing(2),
          },
          "&:hover": {
            color: colors.redDark,
          },
          "&.Mui-selected": {
            borderBottomColor: "white",
            backgroundColor: "white",
          },
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        transitionDuration: 0,
      },
    },
    MuiListItemText: {
      defaultProps: {
        primaryTypographyProps: {
          variant: "body1",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
        },
      },
    },
    MuiList: {
      defaultProps: {
        disablePadding: true,
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&:focus": {
            backgroundColor: "white",
          },
        },
        icon: {
          transition: "transform 400ms",
          width: 18,
          color: "inherit",
        },
        outlined: {
          padding: "10px 44px 11px 14px",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          fontSize: "1em",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderRadius: 2,
          borderWidth: 2,
          borderColor: colors.lighterGray,
        },
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.lighterGray,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#666",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          backgroundColor: "white !important",
          "&:hover": {
            backgroundColor: "white !important",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          position: "absolute !important",
        },
        paper: {
          pointerEvents: "auto",
          textAlign: "left",
          minHeight: 65,
          backgroundColor: "#fff",
          overflowY: "hidden",
          borderRadius: 0,
          margin: 0,
          width: "min-content",
        },
        paperWidthFalse: {
          maxWidth: "none",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 14,
          borderBottom: "1px solid #eee",
          minHeight: 50,
          height: "auto",
          padding: "0 40px 0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          display: "unset",
          overflow: "unset",
          minHeight: "unset",
          "& .MuiTabs-indicator": {
            backgroundColor: "transparent",
          },
        },
      },
    },
  },
};
const theme = createTheme(v5);

export default theme;
