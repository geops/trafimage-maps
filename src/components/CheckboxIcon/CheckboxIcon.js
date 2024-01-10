import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => {
  return {
    box: {
      position: "relative",
      width: 16,
      height: 16,
      border: `1px solid lightgray`,
      margin: 5,
      zIndex: 2,
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    },
    tick: {
      "&::after": {
        content: '""',
        position: "absolute",
        left: 5,
        top: 1,
        width: 5,
        height: 10,
        border: "solid #eb0000",
        borderWidth: "0 1px 1px 0",
        transform: "rotate(45deg)",
      },
    },
  };
});

function CheckboxIcon({ checked }) {
  const classes = useStyles();
  return (
    <div className={`${classes.box}${checked ? ` ${classes.tick}` : ""}`} />
  );
}

CheckboxIcon.propTypes = {
  checked: PropTypes.bool,
};
CheckboxIcon.defaultProps = {
  checked: false,
};

export default CheckboxIcon;
