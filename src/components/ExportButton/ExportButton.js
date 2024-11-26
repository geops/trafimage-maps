import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import CanvasSaveButton from "react-spatial/components/CanvasSaveButton";
import { ScaleLine } from "ol/control";
import html2canvas from "html2canvas";
import Button from "../Button";
import { ReactComponent as Loader } from "./loader.svg";
import {
  getMapHd,
  generateExtraData,
  exportPdf,
  getStyledPdfScaleLine,
  sizesByFormat,
} from "../../utils/exportUtils";
import LayerService from "../../utils/LayerService";
import { trackEvent } from "../../utils/trackingUtils";

const useStyles = makeStyles((theme) => ({
  buttonContent: {
    ...theme.styles.flexCenter,
    padding: "5px 10px",
    height: 35,
    width: 110,
    minWidth: 110,
    backgroundColor: "#dcdcdc",
    "&:hover": {
      backgroundColor: "#cdcdcd",
    },
    "&:disabled": {
      opacity: 0.9,
    },
  },
}));

function ExportButton({
  exportFormat = "a0",
  exportScale = 1, // High res
  exportSize = [3370, 2384], // a0
  exportCoordinates = null,
  exportZoom = null, // 10,
  exportExtent = [620000, 5741000, 1200000, 6058000],
  exportCopyright = false,
  children = <DefaultChildren />,
  style = {},
  id = null,
  scaleLineConfig = null,
  trackingEventOptions = {},
}) {
  const map = useSelector((state) => state.app.map);
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const layers = useSelector((state) => state.map.layers);
  const exportPrintOptions = useSelector(
    (state) => state.app.exportPrintOptions,
  );
  const { t, i18n } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const { exportConfig } = activeTopic || {};

  const renderChildren = () => {
    const styles = {
      pointerEvents: isLoading ? "none" : "auto",
      opacity: isLoading ? 0.5 : 1,
      ...style,
    };
    return isLoading
      ? React.cloneElement(children, {
          isLoading,
          style: styles,
          disabled: true,
        })
      : React.Children.map(children, (child) => {
          return React.cloneElement(child, { style: styles, id });
        });
  };

  return (
    <CanvasSaveButton
      extraData={exportCopyright ? generateExtraData(layers) : null}
      autoDownload={false}
      format="image/jpeg"
      onSaveStart={() => {
        const { getExportFileName } = exportConfig || {};
        if (trackingEventOptions) {
          trackEvent(
            {
              eventType: "download",
              componentName: "secondary button",
              label: t("PDF exportieren"),
              location: t(activeTopic?.name, { lng: "de" }),
              variant: "PDF export",
              value:
                getExportFileName?.(t, exportFormat, i18n.language) ||
                `trafimage-${new Date().toISOString().slice(0, 10)}.pdf`,
              ...trackingEventOptions,
            },
            activeTopic,
          );
        }
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

        let templateValues;
        let imageUrl;
        let fileName;

        if (exportConfig) {
          const { getTemplateValues, getOverlayImageUrl, getExportFileName } =
            exportConfig;
          templateValues = getTemplateValues?.(i18n.language, t);
          imageUrl = getOverlayImageUrl?.(i18n.language, exportFormat);
          fileName = getExportFileName?.(t, exportFormat, i18n.language);
        }

        const scaleLineControl = mapToExport
          .getControls()
          .getArray()
          .find((c) => c instanceof ScaleLine);
        const scaleLineElement =
          scaleLineControl &&
          getStyledPdfScaleLine(scaleLineControl, exportPrintOptions?.quality);
        const scaleLineCanvas =
          scaleLineElement && (await html2canvas(scaleLineElement));

        await exportPdf(
          mapToExport,
          map,
          layers,
          exportFormat,
          canvas,
          exportScale,
          sizesByFormat[exportFormat].map((v) => v * exportScale),
          templateValues,
          imageUrl,
          fileName,
          scaleLineConfig &&
            scaleLineCanvas && {
              ...scaleLineConfig,
              canvas: scaleLineCanvas,
            },
        );
        setLoading(false);
      }}
    >
      {renderChildren()}
    </CanvasSaveButton>
  );
}

function DefaultChildren({ isLoading = false, ...props }) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Button {...props} className={classes.buttonContent} disabled={isLoading}>
      {isLoading && <Loader />}
      {t(isLoading ? "Export läuft..." : "PDF exportieren")}
    </Button>
  );
}

DefaultChildren.propTypes = { isLoading: PropTypes.bool };

DefaultChildren.propTypes = {
  style: PropTypes.object,
  id: PropTypes.string,
  onClick: PropTypes.func,
};

ExportButton.propTypes = {
  exportFormat: PropTypes.string,
  exportExtent: PropTypes.arrayOf(PropTypes.number),
  exportScale: PropTypes.number,
  exportZoom: PropTypes.number,
  exportCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  exportSize: PropTypes.arrayOf(PropTypes.number),
  exportCopyright: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
  id: PropTypes.string,
  scaleLineConfig: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  trackingEventOptions: PropTypes.shape({
    category: PropTypes.string,
    action: PropTypes.string,
    label: PropTypes.string,
    variant: PropTypes.string,
    value: PropTypes.string,
    eventType: PropTypes.string,
    location: PropTypes.string,
    componentName: PropTypes.string,
  }),
};

export default React.memo(ExportButton);
