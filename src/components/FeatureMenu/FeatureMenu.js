import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { FaInfo } from "react-icons/fa";
import useTranslation from "../../utils/useTranslation";
import FeatureInformation from "../FeatureInformation";
import MenuItem from "../Menu/MenuItem";
import { setFeatureInfo, setMenuOpen } from "../../model/app/actions";

const propTypes = {
  menuItemProps: PropTypes.shape({}),
  property: PropTypes.string,
};

/**
 * Generic menu use to display feature info.
 * See TrackerMenu for an example of use.
 */
function FeatureMenu({ property = "useMenu", menuItemProps }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const featureInfo = useSelector((state) => state.app.featureInfo);
  const [collapsed, setCollapsed] = useState(false);

  const filtered = useMemo(() => {
    return featureInfo?.filter((info) => {
      const { layer, features } = info;

      if (layer.get("popupComponent") && layer.get(property)) {
        if (typeof layer.hidePopup === "function") {
          return features.find((f) => !layer.hidePopup(f, layer, featureInfo));
        }
        return true;
      }
      return false;
    });
  }, [featureInfo, property]);

  // Hide the main menu if there is something to display
  useEffect(() => {
    if (filtered?.length) {
      dispatch(setMenuOpen(false));
    }
  }, [dispatch, filtered]);

  // Hide the feature menu when we open the main menu
  useEffect(() => {
    if (!collapsed && menuOpen) {
      dispatch(setFeatureInfo());
    }
  }, [collapsed, dispatch, menuOpen]);

  if (!featureInfo || !featureInfo.length) {
    return null;
  }

  if (!filtered.length) {
    return null;
  }

  return (
    <MenuItem
      className="wkp-feature-menu"
      title={t("Detailinformationen")}
      icon={<FaInfo />}
      open
      collapsed={collapsed}
      onCollapseToggle={(c) => {
        dispatch(setMenuOpen(false));
        setCollapsed(c);
      }}
      onClose={() => {
        dispatch(setFeatureInfo());
      }}
      {...(menuItemProps || {})}
    >
      <FeatureInformation featureInfo={filtered} />
    </MenuItem>
  );
}

FeatureMenu.propTypes = propTypes;

export default FeatureMenu;
