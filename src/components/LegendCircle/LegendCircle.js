import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  circle: {
    ...theme.styles.flexCenter,
    backgroundColor: (props) => props.fillColor,
    width: (props) => props.radius * 2,
    height: (props) => props.radius * 2,
    borderRadius: "50%",
    borderStyle: "solid",
    borderColor: (props) => props.borderColor,
    borderWidth: (props) => props.borderWidth,
  },
}));

function LegendCircle({
  fillColor,
  radius,
  borderColor,
  borderWidth,
  children,
}) {
  const classes = useStyles({
    fillColor,
    radius,
    borderColor,
    borderWidth,
  });
  return <div className={classes.circle}>{children}</div>;
}

LegendCircle.propTypes = {
  fillColor: PropTypes.string.isRequired,
  radius: PropTypes.number,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  children: PropTypes.node,
};

LegendCircle.defaultProps = {
  radius: 8,
  borderColor: "black",
  borderWidth: 0,
  children: null,
};

export default LegendCircle;
