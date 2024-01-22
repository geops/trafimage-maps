import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
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

const options = defaultExportOptions.filter(
  (opt) => /^(a3|a4)$/.test(opt.format) && /^(2|3)$/.test(opt.resolution),
);

function GaExportMenu({ showModal, onClose }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const exportSelection = useExportSelection(options);
  const zoom = useSelector((state) => state.map.zoom);
  const center = useSelector((state) => state.map.center);
  const [exportFullMap, setExportFullMap] = useState(false);
  const exportSize = useMemo(() => {
    return sizesByFormat[exportSelection?.format];
  }, [exportSelection]);
  const scaleLineConfig = useMemo(() => {
    if (!exportSelection || !exportSize) return null;
    const x = exportSize[0] * exportSelection.resolution * 0.09;
    let y = exportSize[1] * exportSelection.resolution * 0.915;
    if (exportSelection.format === "a4") {
      // Since the aspect ratio of A4 is different, we need to adjust the y position
      y -= 8;
    }
    return { x, y };
  }, [exportSelection, exportSize]);

  return (
    showModal && (
      <Dialog
        isModal
        name={NAME}
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
                exportSize={exportSize}
                exportExtent={exportFullMap ? undefined : null} // use default extent when exporting full map
                exportZoom={zoom}
                exportCoordinates={[center, center]}
                exportCopyright={false}
                scaleLineConfig={scaleLineConfig}
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
