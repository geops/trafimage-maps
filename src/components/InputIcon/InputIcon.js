import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@mui/styles";

const useStyles = makeStyles((theme) => {
  return {
    box: {
      position: "relative",
      width: 16,
      height: 16,
      border: `1px solid lightgray`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
      "& svg": {
        margin: 2,
      },
    },
    radio: {
      borderRadius: "50%",
    },
    innerCircle: {
      position: "absolute",
      borderRadius: "50%",
      width: 12,
      height: 12,
      backgroundColor: theme.palette.secondary.main,
    },
  };
});

function InputIcon({ checked, type, "data-cy": dataCy }) {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div
      className={`${classes.box}${type === "radio" ? ` ${classes.radio}` : ""}`}
      data-cy={dataCy}
    >
      {checked && type === "checkbox" && (
        <svg
          width="13.707"
          height="10.051"
          viewBox="0 0 3.627 2.659"
          data-testid="input-icon-tick"
        >
          <path
            fill={theme.palette.secondary.main}
            fillRule="evenodd"
            d="m43.353 31.363-9 8.99-.353.354-.353-.354-4-4 .707-.707L34 39.293l8.647-8.637z"
            clipRule="evenodd"
            transform="matrix(.26458 0 0 .26458 -7.844 -8.111)"
          />
        </svg>
      )}
      {checked && type === "radio" && (
        <div className={classes.innerCircle} data-testid="input-icon-radio" />
      )}
    </div>
  );
}

InputIcon.propTypes = {
  checked: PropTypes.bool,
  type: PropTypes.oneOf(["checkbox", "radio"]),
  "data-cy": PropTypes.string,
};
InputIcon.defaultProps = {
  checked: false,
  type: "checkbox",
  "data-cy": undefined,
};

export default InputIcon;
