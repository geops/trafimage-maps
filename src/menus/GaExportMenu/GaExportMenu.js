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
import useExportSelection from "../../utils/useExportSelection";
import gbLegends from "../../img/geltungsbereicheLegends";

const SWISS_CENTER = [903000, 5899500];

const useStyles = makeStyles(() => ({
  dialogContainer: {
    maxWidth: 500,
  },
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
  dialogRoot: {
    position: "fixed !important",
  },
}));

const options = [...optionsA3, ...optionsA4].filter((opt) =>
  /^(2|3)$/.test(opt.resolution),
);

function GaExportMenu({ showModal, onClose }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const exportSelection = useExportSelection(options);
  const zoom = useSelector((state) => state.map.zoom);
  const center = useSelector((state) => state.map.center);
  const layers = useSelector((state) => state.app.activeTopic)?.layers;
  const [exportFullMap, setExportFullMap] = useState(false);
  const visibleLayerName = useMemo(() => {
    return layers.find((l) => !l.get("isBaseLayer") && l.visible)?.name;
  }, [layers]);

  const pdfSize = useMemo(() => {
    return sizesByFormat[exportSelection?.format];
  }, [exportSelection]);

  const mapSize = useMemo(() => {
    if (!exportSelection || !pdfSize) return null;
    let scale = 1;
    if (exportFullMap) {
      scale = exportSelection.format === "a3" ? 1.95 : 2.25; // Magic scale factor to fit the map to pdf format
    }
    return [pdfSize[0] * scale, pdfSize[1] * scale];
  }, [exportFullMap, exportSelection, pdfSize]);

  const scaleLineConfig = useMemo(() => {
    const getScaleLinePositionFunc = gbLegends.find(
      (l) => l.name === visibleLayerName,
    )?.getScaleLinePosition;
    if (!exportSelection || !pdfSize || !getScaleLinePositionFunc) return null;
    const scaleLinePosition = getScaleLinePositionFunc(
      pdfSize[0],
      exportSelection.resolution,
    );
    return scaleLinePosition;
  }, [exportSelection, pdfSize, visibleLayerName]);

  const exportZoom = useMemo(() => {
    if (!exportSelection || !exportFullMap) return zoom;
    return exportSelection.format === "a3" ? 9.3 : 9;
  }, [exportFullMap, exportSelection, zoom]);

  return (
    showModal && (
      <Dialog
        isModal
        name="ga-export-menu"
        title={<span>{t("Karte als PDF exportieren")}</span>}
        className={`tm-dialog-container ${classes.dialogContainer}`}
        classes={{ root: classes.dialogRoot }}
        onClose={onClose}
        body={
          <div>
            <div className={classes.mainBody}>
              <FormControlLabel
                onChange={(evt) => setExportFullMap(evt.target.checked)}
                control={<Checkbox checked={exportFullMap} />}
                label={
                  <Typography className={classes.checkboxLabel}>
                    {t("Ganze Schweiz exportieren")}
                  </Typography>
                }
              />
              <ExportResolutionSelect
                options={options}
                className={classes.resSelect}
              />
              <Typography paragraph>
                {t(
                  "Aus Platzgründen sind, je nach Zoomstufe, nicht alle Linien angegeben.",
                )}
              </Typography>
            </div>
            <div className={classes.footer}>
              <ExportButton
                exportFormat={exportSelection?.format}
                exportScale={exportSelection?.resolution}
                exportSize={mapSize}
                exportExtent={null} // set null to override default extent
                exportZoom={exportZoom}
                exportCoordinates={
                  exportFullMap
                    ? [SWISS_CENTER, SWISS_CENTER]
                    : [center, center]
                }
                scaleLineConfig={exportFullMap ? null : scaleLineConfig}
              />
            </div>
          </div>
        }
      />
    )
  );
}

GaExportMenu.propTypes = { showModal: PropTypes.bool, onClose: PropTypes.func };
GaExportMenu.defaultProps = { showModal: false, onClose: null };

export default GaExportMenu;
