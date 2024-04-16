/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, withStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { MenuItem as MuiMenuItem, Menu, Button, Divider } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StsValidityLayerSwitcher from "./StsValidityLayerSwitcher";
import DvLayerSwitcher from "../DirektverbindungenMenu/DvLayerSwitcher";
import DvFeatureInfo from "../../config/ch.sbb.direktverbindungen/DvFeatureInfo";
import StsValidityFeatureInfo from "./StsValidityFeatureInfo";
import IframeMenu from "../IframeMenu";
import stsLayers from "../../config/ch.sbb.sts";
import { setFeatureInfo } from "../../model/app/actions";
import {
  DV_HIT_TOLERANCE,
  DV_KEY,
  STS_HIT_TOLERANCE,
} from "../../utils/constants";
import useHasScreenSize from "../../utils/useHasScreenSize";
import useHighlightLayer from "../../utils/useHighlightLayer";
import DvFeatureInfoTitle from "../../config/ch.sbb.direktverbindungen/DvFeatureInfoTitle/DvFeatureInfoTitle";

const boxShadow =
  "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)";

const StyledMenu = withStyles(() => ({
  paper: {
    boxShadow,
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 0,
  },
  list: {
    minWidth: 230,
    padding: "5px 0",
  },
}))(Menu);

const StyledMenuItem = withStyles({
  root: {
    color: "#000000",
    padding: 15,
  },
})(MuiMenuItem);

const useStyles = makeStyles(() => {
  return {
    dropdownToggler: {
      backgroundColor: "white",
      padding: "6px 10px",
      "&:hover": {
        backgroundColor: "white",
      },
    },
    layerSwitcher: {
      padding: "15px 10px",
    },
  };
});

const updateLayers = (key = "sts", baseLayer) => {
  if (key === "sts") {
    stsLayers.forEach((layer) => {
      layer.visible =
        /(ch\.sbb\.sts\.validity(?!\.(highlights|premium|hidden)$)|\.data$)/.test(
          layer.key,
        );
      // Ensure layout visibility is applied after style url change (otherwise hidden layers will be displayed)
      if (layer.applyLayoutVisibility) {
        layer.applyLayoutVisibility();
      }
    });
  }
  if (key === "dv") {
    stsLayers.forEach((layer) => {
      layer.visible = /(ch\.sbb\.(ipv|direktverbindungen)|\.data)/.test(
        layer.key,
      );
      if (layer.key === `${DV_KEY}.main` && baseLayer?.mbMap) {
        baseLayer.mbMap.once("idle", () => {
          layer.syncFeatures();
        });
      }
    });
  }
};
function StsTopicMenu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const layers = useSelector((state) => state.map.layers);
  const isMobile = useHasScreenSize();
  const [activeMenu, setActiveMenu] = useState("sts");
  const [anchorEl, setAnchorEl] = useState();
  const baseLayer = useMemo(() => {
    const bl = stsLayers.find((layer) => layer.get("isBaseLayer"));
    // Since we update the style dynamically on menu switch
    // we update the layers once the style has loaded
    bl.onStyleLoaded = () => updateLayers(activeMenu, bl);
    return bl;
  }, [activeMenu]);

  useEffect(() => {
    // Activate the correct menu on load of the topic.
    const isDirektVerbindungLayersVisible = layers?.find((layer) => {
      return /direktverbindungen/.test(layer.key) && layer.visible;
    });
    if (isDirektVerbindungLayersVisible) {
      setActiveMenu("dv");
    }
  }, [layers]);

  const layerSwitcher = useMemo(
    () =>
      activeMenu === "sts" ? <StsValidityLayerSwitcher /> : <DvLayerSwitcher />,
    [activeMenu],
  );

  const featureInfos = useMemo(
    () =>
      activeMenu === "sts" ? (
        <StsValidityFeatureInfo menuOpen={!featureInfo} />
      ) : (
        <DvFeatureInfo filterByType />
      ),
    [activeMenu, featureInfo],
  );

  useEffect(() => {
    if (activeMenu === "dv") {
      baseLayer.setStyle("base_bright_v2_direktverbindungen");
      baseLayer.hitTolerance = DV_HIT_TOLERANCE;
    }
    if (activeMenu === "sts") {
      baseLayer.setStyle("base_bright_v2_ch.sbb.geltungsbereiche_ga");
      baseLayer.hitTolerance = STS_HIT_TOLERANCE;
    }
  }, [activeMenu, baseLayer]);

  const onChange = (key) => {
    setActiveMenu(key);
    dispatch(setFeatureInfo([]));
    setAnchorEl(null);
  };

  // Hook to highlight map features
  useHighlightLayer(featureInfo);

  return (
    <IframeMenu
      header={
        activeMenu && (
          <>
            <Button
              color="secondary"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={(evt) => setAnchorEl(evt.currentTarget)}
              endIcon={anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              className={classes.dropdownToggler}
              data-testid="sts-menu-opener"
            >
              <b>
                {activeMenu === "sts"
                  ? t("Validity of Swiss Travel Pass")
                  : t("Direct trains to Switzerland")}
              </b>
            </Button>
            <StyledMenu
              keepMounted
              open={!!anchorEl}
              data-cy="sts-select"
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              transitionDuration="auto"
              MenuListProps={{
                autoFocusItem: false,
              }}
              data-testid="sts-menu-popover"
            >
              <StyledMenuItem
                disabled={activeMenu === "sts"}
                onClick={() => onChange("sts")}
                data-testid="sts-menu-sts"
              >
                {t("Validity of Swiss Travel Pass")}
              </StyledMenuItem>
              <StyledMenuItem
                disabled={activeMenu === "dv"}
                onClick={() => onChange("dv")}
                data-testid="sts-menu-dv"
              >
                {t("Direct trains to Switzerland")}
              </StyledMenuItem>
            </StyledMenu>
            <div className={classes.layerSwitcher}>{layerSwitcher}</div>
          </>
        )
      }
      title={activeMenu === "dv" ? <DvFeatureInfoTitle /> : null}
      body={
        <>
          {isMobile ? null : <Divider />}
          {featureInfos}
        </>
      }
    />
  );
}

StsTopicMenu.propTypes = {};

export default StsTopicMenu;
