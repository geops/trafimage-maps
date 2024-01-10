/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
// #############Test################
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Stroke, RegularShape, Fill, Style } from "ol/style";
// #############Test################
import { getCenter } from "ol/extent";
import Dialog from "../../components/Dialog";
import ExportResolutionSelect from "../ExportMenu/ExportResolutionSelect";
import { defaultExportOptions, sizesByFormat } from "../../utils/exportUtils";
import ExportButton from "../../components/ExportButton/ExportButton";
import useExportSelection from "../../utils/useExportSelection";

export const NAME = "gaExportMenu";

const useStyles = makeStyles(() => ({
  dialogContainer: {
    maxWidth: 500,
  },
  resSelect: {
    marginTop: 20,
    width: 190,
  },
  footer: {
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
}));

const options = defaultExportOptions.filter((opt) =>
  /^(a3|a4)$/.test(opt.format),
);

// #############Test################
const markers = new VectorLayer({
  id: "test-markers",
  source: new VectorSource(),
  style: new Style({
    image: new RegularShape({
      fill: new Fill({ color: "red" }),
      stroke: new Stroke({ color: "black", width: 2 }),
      points: 4,
      radius: 10,
      angle: Math.PI / 4,
    }),
  }),
});
// #############Test################

function GaExportMenu() {
  const { t } = useTranslation();
  const classes = useStyles();
  const exportSelection = useExportSelection(options);
  const map = useSelector((state) => state.app.map);
  const pdfSizePxls = useMemo(() => {
    return sizesByFormat[exportSelection?.format];
  }, [exportSelection]);

  const extent = useMemo(() => {
    const ext = map?.getView().calculateExtent(map.getSize());
    if (pdfSizePxls) {
      const center = getCenter(ext);
      const extentHeight = ext && ext[3] - ext[1];
      const extentWidth = ext && ext[2] - ext[0];
      const pdfWidthRatio = pdfSizePxls[0] / pdfSizePxls[1];
      const extentWidthRatio = extentWidth / extentHeight;
      const viewportNotWideEnough = extentWidthRatio < pdfWidthRatio;
      const viewportTooWide = extentWidthRatio > pdfWidthRatio;
      let newMinY = ext[1];
      let newMaxY = ext[3];
      // if (viewportNotWideEnough) {
      //   newMinX = center[0] - (extentWidth * pdfWidthRatio) / 2;
      //   newMaxX = center[0] + (extentWidth * pdfWidthRatio) / 2;
      // }
      if (viewportTooWide) {
        const newHeight = extentWidth / pdfWidthRatio;
        // console.log("heightRatio", newHeight);
        newMinY = center[1] - newHeight / 2;
        newMaxY = center[1] + newHeight / 2;
      }
      const newExtent = [ext[0], newMinY, ext[2], newMaxY];
      // const newExtent = ext;
      const newRatio =
        (newExtent[2] - newExtent[0]) / (newExtent[3] - newExtent[1]);
      map.removeLayer(markers);
      markers.getSource().clear();
      map.addLayer(markers);
      const features = [
        new Feature({
          geometry: new Point(center),
        }),
        new Feature({
          geometry: new Point([newExtent[0], newExtent[1]]),
        }),
        new Feature({
          geometry: new Point([newExtent[2], newExtent[3]]),
        }),
        new Feature({
          geometry: new Point([newExtent[0], newExtent[3]]),
        }),
        new Feature({
          geometry: new Point([newExtent[2], newExtent[1]]),
        }),
      ];
      markers.getSource().addFeatures(features);

      return newExtent;
    }
    return ext;
  }, [map, pdfSizePxls]);

  return (
    <Dialog
      isModal
      name={NAME}
      title={<span>{t("Karte als PDF exportieren")}</span>}
      className={`tm-dialog-container ${classes.dialogContainer}`}
      body={
        <div>
          <div className={classes.mainBody}>
            <ExportResolutionSelect
              options={options}
              className={classes.resSelect}
            />
          </div>
          <div className={classes.footer}>
            <ExportButton
              exportFormat={exportSelection?.format}
              exportScale={exportSelection?.resolution}
              exportSize={sizesByFormat[exportSelection?.format]}
              exportExtent={extent}
              // forceCurrentZoom
            />
          </div>
        </div>
      }
    />
  );
}

export default GaExportMenu;
