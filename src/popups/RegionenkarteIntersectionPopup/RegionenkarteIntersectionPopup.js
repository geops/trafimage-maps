import React from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100px !important",
  },
}));

function RegionenkarteIntersectionPopup({ feature }) {
  const classes = useStyles();
  return <div className={classes.root}>{feature.get("label")}</div>;
}

RegionenkarteIntersectionPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

RegionenkarteIntersectionPopup.hideHeader = () => true;

export default RegionenkarteIntersectionPopup;
