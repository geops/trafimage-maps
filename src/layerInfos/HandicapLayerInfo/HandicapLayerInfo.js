import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useTranslation from "../../utils/useTranslation";
import HandicapLayer from "../../layers/HandicapLayer";

const propTypes = {
  properties: PropTypes.instanceOf(HandicapLayer).isRequired,
};

const useStyles = makeStyles({
  grid: {
    display: "flex",
    gap: 10,
  },
  circle: {
    height: 15,
    minWidth: 15,
    borderRadius: "50%",
  },
});

function HandicapLayerInfo({ properties: layer }) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.grid}>
      <div
        className={classes.circle}
        style={{ backgroundColor: layer.get("color") }}
      />
      <Typography>{t(`${layer.key}.layerinfo`)}</Typography>
    </div>
  );
}

HandicapLayerInfo.propTypes = propTypes;

export default HandicapLayerInfo;
