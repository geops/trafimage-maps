import React from "react";
import { makeStyles } from "@mui/styles";
import useTranslation from "../../utils/useTranslation";
import grun from "./grun.png";
import gelb from "./gelb.png";
import lila from "./lila.png";
import rot from "./rot.png";

const useStyles = makeStyles((theme) => ({
  legend: {
    "& > div": {
      display: "flex",
      alignItems: "center",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    "& img": {
      marginRight: theme.spacing(1),
    },
  },
}));

function RegionenkarteLegend() {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.legend}>
      <div>
        <img src={grun} alt="grun" data-testid="regionenkartelegend-ost" />
        {`${t("Region")} ${t("Ost")}`}
      </div>
      <div>
        <img src={rot} alt="rot" data-testid="regionenkartelegend-sud" />
        {`${t("Region")} ${t("Süd")}`}
      </div>
      <div>
        <img src={lila} alt="lila" data-testid="regionenkartelegend-mitte" />
        {`${t("Region")} ${t("Mitte")}`}
      </div>
      <div>
        <img src={gelb} alt="gelb" data-testid="regionenkartelegend-west" />
        {`${t("Region")} ${t("West")}`}
      </div>
    </div>
  );
}

export default RegionenkarteLegend;
