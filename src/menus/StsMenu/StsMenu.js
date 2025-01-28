/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, withStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { MenuItem as MuiMenuItem, Menu, Button, Divider } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { unByKey } from "ol/Observable";
import StsValidityLayerSwitcher from "./StsValidityLayerSwitcher";
import DvLayerSwitcher from "../DirektverbindungenMenu/DvLayerSwitcher";
import DvFeatureInfo from "../../config/ch.sbb.direktverbindungen/DvFeatureInfo";
import StsValidityFeatureInfo from "./StsValidityFeatureInfo";
import IframeMenu from "../IframeMenu";
import stsLayers from "../../config/ch.sbb.sts";
import { setFeatureInfo } from "../../model/app/actions";
import { DV_KEY } from "../../utils/constants";
import useHasScreenSize from "../../utils/useHasScreenSize";
import useHighlightLayer from "../../utils/useHighlightLayer";
import DvFeatureInfoTitle from "../../config/ch.sbb.direktverbindungen/DvFeatureInfoTitle/DvFeatureInfoTitle";
import SearchInput from "../../components/Search/SearchInput";

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
      padding: "0 10px 15px",
    },
    searchContainer: {
      width: (props) =>
        props.isMobile ? "100%" : "calc(100% - 12px) !important",
      padding: (props) => (props.isMobile ? 0 : 6),
      zIndex: "1100 !important",
      borderRadius: 8,
      "&.wkp-search": {
        left: "0 !important",
        top: (props) => (props.isMobile ? "-2px !important" : "2px !important"),
        right: "unset",
        "& .wkp-search-input": {
          boxShadow: (props) => props.isMobile && boxShadow,
          position: "relative !important",
          borderRadius: 8,
          "& input": {
            borderRadius: 8,
          },
        },
        "& .wkp-search-button-submit": {
          right: "0px !important",
          top: "0px !important",
          borderRadius: "0 7px 7px 0",
        },
        "& .wkp-search-button-clear": {
          right: "42px !important",
          top: "0px !important",
        },
        "& .react-autosuggest__suggestions-container": {
          borderRadius: 8,
          overflow: "hidden",
          boxShadow,
        },
      },
    },
  };
});

const updateLayers = (key = "sts", baseLayer) => {
  if (key === "sts") {
    stsLayers.forEach((layer) => {
      layer.visible =
        /(ch\.sbb\.sts\.validity(?!\.(highlights|premium|hidden)$))/.test(
          layer.key,
        );
      // Ensure layout visibility is applied after style url change (otherwise hidden layers will be displayed)
      layer?.applyLayoutVisibility?.();
    });
  }
  if (key === "dv") {
    stsLayers.forEach((layer) => {
      layer.visible = /(ch\.sbb\.(ipv|direktverbindungen))/.test(layer.key);
      if (layer.key === `${DV_KEY}.main` && baseLayer?.mbMap) {
        baseLayer.mbMap.once("idle", () => {
          layer.syncFeatures();
        });
      }
    });
  }
};

function StsMenu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const layers = useSelector((state) => state.map.layers);
  const isMobile = useHasScreenSize();
  const classes = useStyles({ isMobile });
  const [activeMenu, setActiveMenu] = useState();
  const [anchorEl, setAnchorEl] = useState();
  const displayMenu = useSelector((state) => state.app.displayMenu);
  const stsBaseLayer = useMemo(
    () => stsLayers.find((layer) => /ch.sbb.sts.validity.data/.test(layer.key)),
    [],
  );
  const dvBaseLayer = useMemo(
    () =>
      stsLayers.find((layer) =>
        /ch.sbb.direktverbindungen.data/.test(layer.key),
      ),
    [],
  );

  useEffect(() => {
    // Activate the correct menu on load of the topic.
    const isDirektVerbindungLayersVisible = layers?.find((layer) => {
      return /direktverbindungen/.test(layer.key) && layer.visible;
    });

    // We activate the menu only when the layers are ready after reading the permalink
    if (isDirektVerbindungLayersVisible) {
      setActiveMenu("dv");
    } else {
      setActiveMenu("sts");
    }
  }, [layers]);

  useEffect(() => {
    let updateLayersListeners = [];
    if (dvBaseLayer && stsBaseLayer) {
      updateLayersListeners = [dvBaseLayer, stsBaseLayer].map((layer) =>
        layer?.on("change:visible", (evt) => {
          if (evt.target.visible) {
            evt.target.mbMap?.once("idle", () => {
              updateLayers(activeMenu, layer);
            });
          }
        }),
      );
      if (activeMenu === "dv") {
        dvBaseLayer.visible = true;
        stsBaseLayer.visible = false;
      }
      if (activeMenu === "sts") {
        dvBaseLayer.visible = false;
        stsBaseLayer.visible = true;
      }
    }
    return () => unByKey(updateLayersListeners);
  }, [activeMenu, layers, stsBaseLayer, dvBaseLayer]);

  const onChange = (key) => {
    setActiveMenu(key);
    dispatch(setFeatureInfo([]));
    setAnchorEl(null);
  };

  // Hook to highlight map features
  useHighlightLayer(featureInfo);

  if (!activeMenu) {
    return null;
  }

  return (
    <>
      {isMobile && !displayMenu ? (
        <div className={`wkp-search ${classes.searchContainer}`}>
          <SearchInput />
        </div>
      ) : null}
      <IframeMenu
        header={
          <>
            {!isMobile ? (
              <>
                <div className={`wkp-search ${classes.searchContainer}`}>
                  <SearchInput />
                </div>
                <div style={{ height: 70, width: "100%" }} />
              </>
            ) : null}
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
            <div className={classes.layerSwitcher}>
              {activeMenu === "sts" && <StsValidityLayerSwitcher />}
              {activeMenu === "dv" && <DvLayerSwitcher />}
            </div>
          </>
        }
        title={activeMenu === "dv" && <DvFeatureInfoTitle />}
        body={
          <>
            {!isMobile && <Divider />}
            {activeMenu === "sts" && (
              <StsValidityFeatureInfo menuOpen={!featureInfo} />
            )}
            {activeMenu === "dv" && <DvFeatureInfo filterByType />}
          </>
        }
      />
    </>
  );
}

StsMenu.propTypes = {};

export default StsMenu;
