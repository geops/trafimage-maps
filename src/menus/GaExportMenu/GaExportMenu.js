import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import Dialog from "../../components/Dialog";
import ExportResolutionSelect from "../ExportMenu/ExportResolutionSelect";
import {
  getMapHd,
  optionsA3,
  optionsA4,
  sizesByFormat,
} from "../../utils/exportUtils";
import ExportButton from "../../components/ExportButton/ExportButton";
import useExportSelection from "../../utils/useExportSelection";

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
    gap: 30,
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
  const [exportFullMap, setExportFullMap] = useState(false);
  const pdfSize = useMemo(() => {
    return sizesByFormat[exportSelection?.format];
  }, [exportSelection]);
  const mapSize = useMemo(() => {
    if (!exportSelection || !pdfSize) return null;
    let scale = 1;
    if (exportFullMap) {
      scale = exportSelection.format === "a3" ? 1.59 : 2.25;
    }
    return [pdfSize[0] * scale, pdfSize[1] * scale];
  }, [exportFullMap, exportSelection, pdfSize]);
  const scaleLineConfig = useMemo(() => {
    if (!exportSelection || !pdfSize) return null;
    const x = pdfSize[0] * exportSelection.resolution * 0.026;
    const y = pdfSize[1] * exportSelection.resolution * 0.28;
    return { x, y };
  }, [exportSelection, pdfSize]);

  const onSaveStart = useCallback(
    (map, layerService, scale, coords, size, zoomm, extent) => {
      const displaceLayer = layerService.getLayer(
        "ch.sbb.geltungsbereiche.mvp-labels-displace",
      );
      displaceLayer.addDisplaceFeature();
      return getMapHd(map, layerService, scale, coords, size, zoomm, extent);
    },
    [],
  );

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
                exportZoom={exportFullMap ? 9 : zoom}
                exportCoordinates={
                  exportFullMap
                    ? [SWISS_CENTER, SWISS_CENTER]
                    : [center, center]
                }
                exportCopyright={false}
                scaleLineConfig={exportFullMap ? null : scaleLineConfig}
                onSaveStart={onSaveStart}
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
