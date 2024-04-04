/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Divider } from "@mui/material";
import DvFeatureInfo from "../../config/ch.sbb.direktverbindungen/DvFeatureInfo";
import DvLayerSwitcher from "./DvLayerSwitcher";
import { setDisplayMenu } from "../../model/app/actions";
import IframeMenu from "../IframeMenu";
import useIsMobile from "../../utils/useIsMobile";
import useHighlightLayer from "../../utils/useHighlightLayer";
import DvFeatureInfoTitle from "../../config/ch.sbb.direktverbindungen/DvFeatureInfoTitle/DvFeatureInfoTitle";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      padding: 15,
    },
    listHeader: {
      padding: "5px 12px",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#f5f5f5",
    },
  };
});

function DvMenu() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const isMobile = useIsMobile();

  const urlSearch = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );

  const switcher = useMemo(
    () => (
      <div className={classes.wrapper}>
        <DvLayerSwitcher row={isMobile} />
      </div>
    ),
    [classes.wrapper, isMobile],
  );

  const showSwitcher = useMemo(() => {
    // Completely hide the switcher via the permalink
    return urlSearch.get("direktverbindungen.menu") !== "false";
  }, [urlSearch]);

  const hideMenu = useMemo(() => {
    // Hide the menu if the switcher is hidden and no features are selected
    return !showSwitcher && !featureInfo?.length;
  }, [featureInfo?.length, showSwitcher]);

  useEffect(() => {
    // Hide menu and zoom buttons on mobile
    dispatch(setDisplayMenu(!isMobile));
  }, [isMobile, dispatch]);

  // Hook to highlight map features
  useHighlightLayer(featureInfo.features, featureInfo);

  return (
    <IframeMenu
      hide={hideMenu}
      header={showSwitcher ? switcher : null}
      title={<DvFeatureInfoTitle />}
      body={
        <>
          {showSwitcher && isMobile ? switcher : null}
          {showSwitcher && isMobile ? <Divider /> : null}
          <DvFeatureInfo filterByType />
        </>
      }
    />
  );
}

export default DvMenu;
