import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DV_KEY } from "../../../utils/constants";
import useIsMobile from "../../../utils/useIsMobile";
import { setFeatureInfo } from "../../../model/app/actions";
import CloseButton from "../../../components/CloseButton";

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
      <CloseButton
        onClick={() => {
          dvMainLayer.highlightStation();
          dispatch(setFeatureInfo());
        }}
      />
    </Box>
  );
}

export default DvFeatureInfoTitle;
