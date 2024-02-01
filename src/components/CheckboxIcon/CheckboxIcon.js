import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@mui/styles";

const useStyles = makeStyles(() => {
  return {
    box: {
      position: "relative",
      width: 16,
      height: 16,
      border: `1px solid lightgray`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        margin: 2,
      },
      zIndex: 2,
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    },
  };
});

function CheckboxIcon({ checked }) {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.box}>
      {checked && (
        <svg width="13.707" height="10.051" viewBox="0 0 3.627 2.659">
          <path
            fill={theme.palette.secondary.main}
            fillRule="evenodd"
            d="m43.353 31.363-9 8.99-.353.354-.353-.354-4-4 .707-.707L34 39.293l8.647-8.637z"
            clipRule="evenodd"
            transform="matrix(.26458 0 0 .26458 -7.844 -8.111)"
          />
        </svg>
      )}
    </div>
  );
}

CheckboxIcon.propTypes = {
  checked: PropTypes.bool,
};
CheckboxIcon.defaultProps = {
  checked: false,
};

export default CheckboxIcon;
