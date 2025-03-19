import React from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
  root: {
    minWidth: "max-content !important",
    maxHeight: 200,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
}));

function KilometragePopup({ feature }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { lines } = feature.getProperties();

  return (
    <div className={classes.root}>
      {lines?.map((l) => {
        return (
          // TRAFKLEIN-848: Safari only apply minWidth  the size of the child so the p must have the all width
          <Typography key={l.line} style={{ width: "max-content" }}>
            {`${t("Linien-Nr.")} ${l.line}`}, {`km ${Number(l.km).toFixed(2)}`}
          </Typography>
        );
      })}
    </div>
  );
}

KilometragePopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

KilometragePopup.hideHeader = () => true;

export default KilometragePopup;
