import React from "react";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import RsFitExtent from "react-spatial/components/FitExtent";
import MapButton from "../../MapButton";
import { SWISS_EXTENT } from "../../../utils/constants";
import { ReactComponent as SwissBounds } from "../../../img/swissbounds.svg";
import { trackEvent } from "../../../utils/trackingUtils";

const useStyles = makeStyles((theme) => ({
  fitExtent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    color: theme.colors.darkGray,
    "& svg": { scale: 0.8 },
    "&:hover": {
      color: theme.colors.darkGray,
    },
  },
  rsFitExtent: {
    borderRadius: "50%",
    height: "100%",
    width: "100%",
  },
}));

function FitExtent() {
  const classes = useStyles();
  const { t } = useTranslation();
  const map = useSelector((state) => state.app.map);
  return (
    <MapButton
      className={`wkp-fit-extent ${classes.fitExtent}`}
      data-testid="map-controls-fit-extent"
      tabIndex={-1}
      onClick={() => {
        trackEvent({
          eventType: "action",
          componentName: "icon button",
          label: t("Ganze Schweiz"),
          variant: "Ganze Schweiz",
        });
      }}
    >
      <RsFitExtent
        map={map}
        title={t("Ganze Schweiz")}
        extent={SWISS_EXTENT}
        className={classes.rsFitExtent}
      >
        <SwissBounds focusable={false} />
      </RsFitExtent>
    </MapButton>
  );
}

export default FitExtent;
