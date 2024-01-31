import React from "react";
import { makeStyles } from "@mui/styles";
import { Switch } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 40,
    height: "100%",
    padding: 0,
    margin: "4px 10px 4px 0",
    overflow: "visible",
    alignItems: "center",
  },
  switchBase: {
    padding: 3,
    color: "white",
    "&$checked": {
      transform: "translateX(14px)",
      color: "white",
      "& + $track": {
        opacity: 1,
        backgroundColor: "#eb0000",
      },
    },
  },
  thumb: {
    width: 20,
    height: 20,
    boxShadow:
      "0 1px 1px 0 rgb(0 0 0 / 7%), 0 0 1px 1px rgb(0 0 0 / 11%), 0 4px 2px 0 rgb(0 0 0 / 10%), 0 4px 9px 2px rgb(0 0 0 / 8%)",
  },
  track: {
    height: 24,
    borderRadius: 24,
    border: `1px solid #e5e5e5`,
    opacity: 1,
    backgroundColor: theme.palette.grey[500],
  },
  checked: {},
}));

function SBBSwitch(props) {
  const classes = useStyles();
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Switch classes={classes} {...props} />;
}

export default SBBSwitch;
