import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { unByKey } from "ol/Observable";
import getLayersAsFlatArray from "../../utils/getLayersAsFlatArray";
import Button from "../Button";
import { ReactComponent as MenuOpenImg } from "../../img/sbb/040_hamburgermenu_102_36.svg";
import { ReactComponent as MenuClosedImg } from "../../img/sbb/040_schliessen_104_36.svg";

function TopicsMenuHeader({ isOpen, onToggle }) {
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const layers = useSelector((state) => state.map.layers);
  const [forceRender, setForceRender] = useState(1);
  const { t } = useTranslation();
  useEffect(() => {
    const keys = getLayersAsFlatArray(layers || []).map((layer) =>
      layer.on("change:visible", () => {
        setForceRender(forceRender + 1);
      }),
    );
    return () => {
      unByKey(keys);
    };
  }, [layers, forceRender]);

  const layerNames = useMemo(() => {
    const flatLayers = getLayersAsFlatArray(layers || []) || [];
    const topicLayers = flatLayers.reverse().filter((l) => {
      return (
        !l.get("isBaseLayer") &&
        !l.get("hideInLegend") &&
        !flatLayers.includes(l.parent) // only root layers
      );
    });
    const visibleLayers = topicLayers.filter((l) => l.visible);
    return visibleLayers.length > 0 &&
      visibleLayers.length === topicLayers.length
      ? ["alle aktiviert"]
      : visibleLayers.map((l) => l.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers, forceRender]);

  return (
    <Button
      className={`wkp-menu-header${isOpen ? " open" : ""}`}
      ariaExpanded={isOpen}
      tabIndex={0}
      title={t("Menü")}
      onClick={() => onToggle()}
    >
      <div className="wkp-menu-header-mobile">
        <div className="wkp-menu-header-toggler">
          {isOpen ? <MenuClosedImg /> : <MenuOpenImg />}
          <span className="wkp-menu-header-menu-title">{t("Menü")}</span>
        </div>
      </div>

      <div className="wkp-menu-header-desktop">
        <div className={`wkp-menu-title ${!layerNames.length ? "" : "large"}`}>
          {t(activeTopic?.name)}
        </div>
        <div className="wkp-menu-toggler">
          {isOpen ? (
            <FaAngleUp focusable={false} />
          ) : (
            <FaAngleDown focusable={false} />
          )}
        </div>
        <div className={`wkp-menu-layers ${layerNames.length ? "" : "hidden"}`}>
          {
            layerNames
              .map((layerName) => t(layerName))
              .join(", ")
              .replace(/<\/?[^>]+(>|$)/g, "") // clean html tags
          }
        </div>
      </div>
    </Button>
  );
}

TopicsMenuHeader.propTypes = {
  onToggle: PropTypes.func,
  isOpen: PropTypes.bool,
};

TopicsMenuHeader.defaultProps = {
  isOpen: false,
  onToggle: () => {},
};

export default React.memo(TopicsMenuHeader);
