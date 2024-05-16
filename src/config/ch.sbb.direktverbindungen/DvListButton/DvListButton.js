import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { unByKey } from "ol/Observable";
import { extend, createEmpty } from "ol/extent";
import MapButton from "../../../components/MapButton";
import { setFeatureInfo } from "../../../model/app/actions";
import { DV_KEY } from "../../../utils/constants";
import { ReactComponent as List } from "../../../img/list-icon-sbb.svg";

const getExtentFromFeatures = (features) => {
  let extent = createEmpty();
  features.forEach((feat) => {
    extent = extend(extent, feat.getGeometry().getExtent());
  });
  return extent;
};

function DvListButton({ ...props }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const layers = useSelector((state) => state.map.layers);
  const map = useSelector((state) => state.app.map);
  const dvMainLayer = useMemo(
    () => layers.find((l) => l.key === `${DV_KEY}.main`),
    [layers],
  );
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const loadFeatsListener = dvMainLayer?.on("sync:features", (evt) => {
      setFeatures(evt.features);
    });
    return () => unByKey(loadFeatsListener);
  }, [dvMainLayer]);

  return (
    <MapButton
      style={{ padding: 8 }}
      title={t("Alle Direktverbindungen anzeigen")}
      disabled={!features?.length}
      data-testid="dv-list-button"
      onClick={() => {
        if (!features?.length) return;
        const view = map.getView();
        const extent = getExtentFromFeatures(features);
        view.cancelAnimations();
        view.fit(extent, {
          duration: 500,
          padding: [100, 100, 100, 100],
          maxZoom: 6,
          callback: () => {
            const { maplibreMap } = dvMainLayer.mapboxLayer;
            if (maplibreMap) {
              maplibreMap.once("idle", () => {
                dvMainLayer.syncFeatures();
                dvMainLayer.highlightStation();
                dispatch(
                  setFeatureInfo([
                    {
                      features: dvMainLayer.allFeatures,
                      layer: dvMainLayer,
                    },
                  ]),
                );
              });
            }
          },
        });
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <List />
    </MapButton>
  );
}

export default DvListButton;
