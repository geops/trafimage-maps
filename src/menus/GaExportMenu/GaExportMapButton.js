import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { BsDownload } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { unByKey } from "ol/Observable";
import MapButton from "../../components/MapButton";
import GaExportMenu from "./GaExportMenu";
import useIsMobile from "../../utils/useHasScreenSize";

const useVisibleLayer = (layers) => {
  const [visible, setVisible] = useState(false);
  const getVisible = useCallback(() => {
    setVisible(layers.some((l) => l.get("visible")));
  }, [layers]);
  useEffect(() => {
    getVisible();
    const listeners = layers.map((l) => l.on("change:visible", getVisible));
    return () => unByKey(listeners);
  }, [layers, getVisible]);
  return visible;
};

function GaExportMapButton() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const layers = useSelector((state) => state.map.layers);
  const exportableLayers = layers.filter((layer) => layer.get("isExportable"));
  const showButton = useVisibleLayer(exportableLayers);
  return (
    !isMobile &&
    showButton && (
      <>
        <MapButton
          onClick={() => setShowMenu(!showMenu)}
          style={{ padding: 8, color: "#444" }}
          title={t("Karte als PDF exportieren")}
        >
          <BsDownload />
        </MapButton>
        {showMenu && <GaExportMenu onClose={() => setShowMenu(false)} />}
      </>
    )
  );
}

export default GaExportMapButton;
