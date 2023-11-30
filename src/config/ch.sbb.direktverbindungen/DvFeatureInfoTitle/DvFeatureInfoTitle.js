import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Box, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MdClose } from "react-icons/md";
import { DV_KEY } from "../../../utils/constants";
import useIsMobile from "../../../utils/useIsMobile";
import { setFeatureInfo } from "../../../model/app/actions";

const useStyles = makeStyles(() => {
  return {
    listHeader: {
      paddingLeft: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#f5f5f5",
      borderBottom: `1px solid #F0F0F0`,
    },
    closeButton: {
      paddingRight: 15,
    },
  };
});

export const DvFeatureInfoTitleString = () => {
  const { t } = useTranslation();
  const layers = useSelector((state) => state.map.layers);
  const dvMainLayer = useMemo(
    () => layers.find((l) => l.key === `${DV_KEY}.main`),
    [layers],
  );
  const stationName = dvMainLayer?.highlightedStation?.get("name");
  return `${t("Direktverbindungen")} ${
    stationName ? ` ${t("über")} ${stationName}` : ""
  }`;
};

function DvFeatureInfoTitle() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const isMobile = useIsMobile();
  const layers = useSelector((state) => state.map.layers);
  const dvMainLayer = useMemo(
    () => layers.find((l) => l.key === `${DV_KEY}.main`),
    [layers],
  );

  return isMobile ? (
    <DvFeatureInfoTitleString />
  ) : (
    <Box className={classes.listHeader}>
      <b>
        <DvFeatureInfoTitleString />
      </b>
      <IconButton
        size="medium"
        className={`${classes.closeButton} wkp-close-bt`}
        title={t("Schliessen")}
        onClick={() => {
          dvMainLayer.highlightStation();
          dispatch(setFeatureInfo());
        }}
      >
        <MdClose focusable={false} alt={t("Schliessen")} />
      </IconButton>
    </Box>
  );
}

export default DvFeatureInfoTitle;
