import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { BsDownload } from "react-icons/bs";
import MapButton from "../../components/MapButton";
import GaExportMenu from "./GaExportMenu";
import useIsMobile from "../../utils/useIsMobile";

const useGetVisible = (layers) => {
  const [visible, setVisible] = useState(false);
  const getVisible = useCallback(() => {
    setVisible(layers.some((l) => l.get("visible")));
  }, [layers]);
  useEffect(() => {
    getVisible();
    layers.forEach((l) => l.on("change:visible", getVisible));
    return () => {
      layers.forEach((l) => l.un("change:visible", getVisible));
    };
  }, [layers, getVisible]);
  return visible;
};

function GaExportMapButton() {
  const isMobile = useIsMobile();
  const [showMenu, setShowMenu] = useState(false);
  const layers = useSelector((state) => state.map.layers);
  const exportableGbLayers = layers.filter((layer) =>
    layer.get("isExportable"),
  );
  const showButton = useGetVisible(exportableGbLayers);
  return (
    !isMobile &&
    showButton && (
      <>
        <MapButton
          onClick={() => setShowMenu(!showMenu)}
          style={{ padding: 8, color: "#444" }}
        >
          <BsDownload />
        </MapButton>
        <GaExportMenu showModal={showMenu} onClose={() => setShowMenu(false)} />
      </>
    )
  );
}

export default GaExportMapButton;
