import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import CanvasSaveButton from "react-spatial/components/CanvasSaveButton";
import html2canvas from "html2canvas";
import { ScaleLine } from "ol/control";
import { ReactComponent as Loader } from "./loader.svg";
import {
  getMapHd,
  generateExtraData,
  exportPdf,
} from "../../utils/exportUtils";
import LayerService from "../../utils/LayerService";

const flexCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const useStyles = makeStyles(() => ({
  buttonContent: {
    ...flexCenter,
    padding: "5px 10px",
    height: 35,
    width: 110,
    backgroundColor: "#dcdcdc",
    "&:hover": {
      backgroundColor: "#cdcdcd",
    },
  },
  canvasButton: {
    ...flexCenter,
  },
}));

function ExportButton({
  exportFormat,
  exportScale,
  exportSize,
  exportCoordinates,
  exportZoom,
  exportExtent,
  children,
  loadingComponent,
  style,
  id,
  scalebarConfig,
}) {
  const classes = useStyles();
  const map = useSelector((state) => state.app.map);
  const topic = useSelector((state) => state.app.activeTopic);
  const layers = useSelector((state) => state.map.layers);
  const { t, i18n } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  return (
    <CanvasSaveButton
      id={id}
      title={t("Karte als PDF exportieren")}
      className={classes.canvasButton}
      style={{
        pointerEvents: isLoading ? "none" : "auto",
        opacity: isLoading ? 0.3 : 1,
        ...style,
      }}
      extraData={generateExtraData(layers)}
      autoDownload={false}
      format="image/jpeg"
      onSaveStart={() => {
        setLoading(true);
        return getMapHd(
          map,
          new LayerService(layers),
          exportScale,
          exportCoordinates,
          exportSize,
          exportZoom,
          exportExtent,
        );
      }}
      onSaveEnd={async (mapToExport, canvas) => {
        if (!mapToExport) {
          setLoading(false);
          return;
        }

        let templateValues = {};
        let imageUrl;
        let fileName = `trafimage-${new Date().toISOString().slice(0, 10)}.pdf`;

        const { exportConfig } = topic;
        if (exportConfig) {
          const { getTemplateValues, getOverlayImageUrl, getExportFileName } =
            exportConfig;
          templateValues = getTemplateValues
            ? getTemplateValues(i18n.language, t)
            : {};
          imageUrl = getOverlayImageUrl && getOverlayImageUrl(i18n.language, t);
          fileName = getExportFileName
            ? getExportFileName(i18n.language, t)
            : fileName;
        }

        const scaleLine = mapToExport
          .getControls()
          .getArray()
          .find((c) => c instanceof ScaleLine);

        let scaleLineCanvas;
        if (scalebarConfig) {
          if (
            scaleLine.element &&
            scaleLine.element.getBoundingClientRect().width
          ) {
            scaleLineCanvas = await html2canvas(scaleLine.element);
          }
        }

        // console.log(scaleLine.element.getBoundingClientRect());

        await exportPdf(
          mapToExport,
          map,
          layers,
          exportFormat,
          canvas,
          exportScale,
          exportSize,
          templateValues,
          imageUrl,
          fileName,
          {
            ...scalebarConfig,
            canvas: scaleLineCanvas,
          },
          scaleLine.element,
        );
        setLoading(false);
      }}
    >
      {isLoading ? loadingComponent : children}
    </CanvasSaveButton>
  );
}

function DefaultLoadingComponent() {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <span className={classes.buttonContent}>
      <Loader />
      {t("Export läuft...")}
    </span>
  );
}

function DefaultChildren() {
  const classes = useStyles();
  const { t } = useTranslation();
  return <span className={classes.buttonContent}>{t("PDF exportieren")}</span>;
}

ExportButton.propTypes = {
  exportFormat: PropTypes.string,
  exportExtent: PropTypes.arrayOf(PropTypes.number),
  exportScale: PropTypes.number,
  exportZoom: PropTypes.number,
  exportCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  children: PropTypes.node,
  exportSize: PropTypes.arrayOf(PropTypes.number),
  loadingComponent: PropTypes.node,
  style: PropTypes.object,
  id: PropTypes.string,
  scalebarConfig: PropTypes.shape({
    element: PropTypes.instanceOf(Element),
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

ExportButton.defaultProps = {
  exportFormat: "a0",
  exportScale: 1, // High res,
  exportCoordinates: null,
  exportZoom: null, // 10,
  exportExtent: [620000, 5741000, 1200000, 6058000],
  children: <DefaultChildren />,
  exportSize: [3370, 2384], // a0
  loadingComponent: <DefaultLoadingComponent />,
  style: {},
  id: null,
  scalebarConfig: null,
};

export default React.memo(ExportButton);
