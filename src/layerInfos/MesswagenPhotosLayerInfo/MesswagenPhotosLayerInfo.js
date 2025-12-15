import React from "react";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useTranslation from "../../utils/useTranslation";
import LegendCircle from "../../components/LegendCircle/LegendCircle";

const useStyles = makeStyles((theme) => ({
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 8fr",
    gridGap: theme.spacing(1),
  },
}));

function MesswagenPhotosLayerInfo() {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.grid}>
      <LegendCircle fillColor="#eb0000" />
      <Typography>{t("SBB-Funkmesswagen")}</Typography>
      <LegendCircle fillColor="#2d567d" />
      <Typography>{t("Verschiedenes")}</Typography>
    </div>
  );
}

export default MesswagenPhotosLayerInfo;
