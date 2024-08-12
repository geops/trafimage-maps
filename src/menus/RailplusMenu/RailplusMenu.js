/* eslint-disable no-param-reassign */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import IframeMenu from "../IframeMenu";
import { RailplusPopup } from "../../popups";
import { setFeatureInfo } from "../../model/app/actions";
import useHasScreenSize from "../../utils/useHasScreenSize";
import usePanCenterFeature from "../../utils/usePanCenterFeature";
import CloseButton from "../../components/CloseButton";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      padding: 15,
      maxHeight: "calc(100vh - 80px)",
      overflow: "auto",
    },
    listHeader: {
      paddingLeft: (props) => (props.isMobile ? 0 : 15),
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#f5f5f5",
      borderBottom: `1px solid #F0F0F0`,
    },
  };
});

function RailplusMenu() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMobile = useHasScreenSize();
  const classes = useStyles({ isMobile });
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const feature = featureInfo[0]?.features[0];
  const layer = featureInfo[0]?.layer;
  usePanCenterFeature();

  if (!feature || !layer) {
    return null;
  }

  return (
    <IframeMenu
      ResizableProps={{
        defaultSize: { height: "auto" },
      }}
      title={
        <Box className={classes.listHeader}>
          <b>{t(layer.key)}</b>
          {!isMobile && (
            <CloseButton
              size="medium"
              style={{ width: 40, height: 40 }}
              title={t("Schliessen")}
              onClick={() => {
                dispatch(setFeatureInfo());
              }}
            />
          )}
        </Box>
      }
      body={
        <div className={classes.wrapper}>
          <RailplusPopup feature={feature} layer={layer} />
        </div>
      }
    />
  );
}

export default RailplusMenu;
