import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import Dialog from "../../components/Dialog";
import ExportResolutionSelect from "../ExportMenu/ExportResolutionSelect";
import { optionsA3, optionsA4, sizesByFormat } from "../../utils/exportUtils";
import ExportButton from "../../components/ExportButton/ExportButton";
import useExportPrintOptions from "../../utils/useExportPrintOptions";
import gbLegends from "../../img/geltungsbereicheLegends";

const SWISS_CENTER = [903000, 5899500];

const useStylesBody = makeStyles(() => ({
  resSelect: {
    width: 190,
  },
  mainBody: {
    display: "flex",
    flexDirection: "column",
    gap: 25,
  },
  footer: {
    padding: "10px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  checkboxLabel: {
    padding: "10px 0 10px 10px",
  },
}));

const useStylesDialog = makeStyles(() => ({
  dialogRoot: {
    position: "fixed !important",
  },
  dialogContainer: {
    maxWidth: 500,
  },
}));

const options = [...optionsA3, ...optionsA4].filter((opt) =>
  /^(2|3)$/.test(opt.quality),
);

function GaExportMenu({ onClose }) {
  const { t } = useTranslation();
  const classesBody = useStylesBody();
  const classesDialog = useStylesDialog();
  const exportPrintOptions = useExportPrintOptions(options);
  const zoom = useSelector((state) => state.map.zoom);
  const center = useSelector((state) => state.map.center);
  const layers = useSelector((state) => state.app.activeTopic)?.layers;
  const [exportFullMap, setExportFullMap] = useState(false);
  const visibleLayerName = useMemo(() => {
    return layers.find((l) => !l.get("isBaseLayer") && l.visible)?.name;
  }, [layers]);

  const pdfSize = useMemo(() => {
    return sizesByFormat[exportPrintOptions?.paperSize];
  }, [exportPrintOptions]);

  const mapSize = useMemo(() => {
    if (!exportPrintOptions || !pdfSize) return null;
    let scale = 1;
    if (exportFullMap) {
      scale = exportPrintOptions.paperSize === "a3" ? 1.95 : 2.25; // Magic scale factor to fit the map to pdf format
    }
    return [pdfSize[0] * scale, pdfSize[1] * scale];
  }, [exportFullMap, exportPrintOptions, pdfSize]);

  const scaleLineConfig = useMemo(() => {
    const getScaleLinePositionFunc = gbLegends.find(
      (l) => l.validity === visibleLayerName,
    )?.getScaleLinePosition;
    if (!exportPrintOptions || !pdfSize || !getScaleLinePositionFunc)
      return null;
    const scaleLinePosition = getScaleLinePositionFunc(
      pdfSize,
      exportPrintOptions.quality,
    );
    return scaleLinePosition;
  }, [exportPrintOptions, pdfSize, visibleLayerName]);

  const exportZoom = useMemo(() => {
    if (!exportPrintOptions || !exportFullMap) return zoom;
    return exportPrintOptions.paperSize === "a3" ? 9.3 : 9;
  }, [exportFullMap, exportPrintOptions, zoom]);

  return (
    <Dialog
      isModal
      name="ga-export-menu"
      title={<span>{t("Karte als PDF exportieren")}</span>}
      className="tm-dialog-container"
      classes={{
        root: classesDialog.dialogRoot,
        paper: classesDialog.dialogContainer,
      }}
      onClose={onClose}
      body={
        <div>
          <div className={classesBody.mainBody}>
            <FormControlLabel
              onChange={(evt) => setExportFullMap(evt.target.checked)}
              control={<Checkbox checked={exportFullMap} />}
              label={
                <Typography className={classesBody.checkboxLabel}>
                  {t("Ganze Schweiz exportieren")}
                </Typography>
              }
            />
            <ExportResolutionSelect
              options={options}
              className={classesBody.resSelect}
            />
            <Typography paragraph>
              {t(
                "Aus Platzgründen sind, je nach Zoomstufe, nicht alle Linien angegeben.",
              )}
            </Typography>
          </div>
          <div className={classesBody.footer}>
            <ExportButton
              exportFormat={exportPrintOptions?.paperSize}
              exportScale={exportPrintOptions?.quality}
              exportSize={mapSize}
              exportExtent={null} // set null to override default extent
              exportZoom={exportZoom}
              exportCoordinates={
                exportFullMap ? [SWISS_CENTER, SWISS_CENTER] : [center, center]
              }
              scaleLineConfig={exportFullMap ? null : scaleLineConfig}
            />
          </div>
        </div>
      }
    />
  );
}

GaExportMenu.propTypes = { onClose: PropTypes.func };
GaExportMenu.defaultProps = { onClose: null };

export default GaExportMenu;
