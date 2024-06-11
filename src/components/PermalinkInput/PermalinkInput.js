import React from "react";
import { makeStyles } from "@mui/styles";
import UIPermalinkInput from "../PermalinkInputCore";

const useStyles = makeStyles(() => ({
  input: {
    display: "flex",
    justifyContent: "flex-end",
    width: "calc(100% - 4px)",
    height: 30,
    border: "1px solid lightgray",
    backgroundColor: "white",

    "& input,    & button,    & svg": {
      border: "none",
    },

    "& input": {
      flexGrow: 2,
      textOverflow: "ellipsis",
      minWidth: 0,
      paddingLeft: 5,

      "&::-ms-clear": {
        display: "none",
      },
    },

    "& button": {
      width: 30,
      height: "100%",
      flexShrink: 0,
      borderLeft: "1px solid lightgray",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 7,
    },
  },
}));

function PermalinkInput(props) {
  const classes = useStyles();

  return <UIPermalinkInput className={classes.input} {...props} />;
}

export default React.memo(PermalinkInput);
