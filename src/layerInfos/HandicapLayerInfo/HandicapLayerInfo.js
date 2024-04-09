import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { withTranslation } from "react-i18next";
import HandicapLayer from "../../layers/HandicapLayer";

const propTypes = {
  t: PropTypes.func.isRequired,
  properties: PropTypes.instanceOf(HandicapLayer).isRequired,
};

const useStyles = makeStyles((theme) => ({
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 8fr",
    gridGap: theme.spacing(1),
  },
  circle: {
    marginTop: 2,
    height: 15,
    width: 15,
    borderRadius: "50%",
  },
}));

function HandicapLayerInfo(props) {
  const { t, properties: layer } = props;
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

export default withTranslation()(HandicapLayerInfo);
