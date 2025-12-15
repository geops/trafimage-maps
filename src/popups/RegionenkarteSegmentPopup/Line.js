import React from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { makeStyles } from "@mui/styles";
import useTranslation from "../../utils/useTranslation";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing(2),
    flex: "0 0",
  },
  km: {
    paddingLeft: theme.spacing(1),
  },
}));

function Line({ feature }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    line_number: lineNumber,
    bp_von: bpStart,
    bp_bis: bpEnd,
    km_start: kmStart,
    km_end: kmEnd,
  } = feature.getProperties();

  return (
    <div className={classes.title}>
      <div>
        {!!lineNumber && `${t("Linie")} ${lineNumber}, `}
        {bpStart && bpEnd && `${t("BPs")} ${bpStart} - ${bpEnd}`}
        {((bpStart && !bpEnd) || (!bpStart && bpEnd)) &&
          `${t("BP")} ${bpStart || bpEnd}`}
      </div>
      <div className={classes.km}>{`km ${kmStart} - ${kmEnd}`}</div>
    </div>
  );
}

Line.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

export default Line;
