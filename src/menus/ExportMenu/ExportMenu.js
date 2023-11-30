import React, { useState, useEffect, useCallback, useMemo } from "react";
import canvasSize from "canvas-size";
import { cancelable } from "cancelable-promise";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FaDownload, FaInfoCircle } from "react-icons/fa";
import { makeStyles } from "@mui/styles";
import MuiMenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "../../components/Select";
import MenuItem from "../../components/Menu/MenuItem";
import ExportButton from "../../components/ExportButton";

const LS_SIZE_KEY = "tm.max.canvas.size";

const useStyles = makeStyles((theme) => ({
  menuContent: {
    padding: 16,
    overflow: "hidden",
  },
  selectWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
  },
  label: {
    top: -18,
  },
  input: {
    width: 140,
    height: 44,
  },
  infoWrapper: {
    display: "flex",
    alignItems: "start",
    margin: "10px 0",
  },
  infoIcon: {
    marginRight: theme.spacing(1),
    flexShrink: 0,
    paddingTop: 3,
    color: theme.palette.text.secondary,
  },
}));

const sizesByFormat = {
  // https://www.din-formate.de/reihe-a-din-groessen-mm-pixel-dpi.html
  a0: [3370, 2384],
  a1: [2384, 1684],
};

const options = [
  { label: "A0 (72 dpi)", resolution: 1, format: "a0", weight: 2 },
  { label: "A0 (150 dpi)", resolution: 2, format: "a0", weight: 4 },
  { label: "A0 (300 dpi)", resolution: 3, format: "a0", weight: 6 },
  { label: "A1 (72 dpi)", resolution: 1, format: "a1", weight: 1 },
  { label: "A1 (150 dpi)", resolution: 2, format: "a1", weight: 3 },
  { label: "A1 (300 dpi)", resolution: 3, format: "a1", weight: 5 },
];

const validateOption = (format, exportScale, maxCanvasSize, map) => {
  if (!map || !maxCanvasSize) {
    return true;
  }
  const exportSize = sizesByFormat[format];
  const mapSize = map.getSize();
  return (
    (maxCanvasSize &&
      ((exportSize &&
        (maxCanvasSize < exportSize[0] * exportScale ||
          maxCanvasSize < exportSize[1] * exportScale)) ||
        (!exportSize &&
          mapSize &&
          (maxCanvasSize < mapSize[0] * exportScale ||
            maxCanvasSize < mapSize[1] * exportScale)))) ||
    false
  );
};

const getHighestPossibleRes = (maxCanvasSize, map) => {
  const highestRes = options.reduce((final, option) => {
    let newFinal = { ...final };
    if (
      !validateOption(option.format, option.resolution, maxCanvasSize, map) &&
      option.weight > (final.weight || 0)
    ) {
      newFinal = option;
    }
    return newFinal;
  });
  return { format: highestRes.format, resolution: highestRes.resolution };
};

function ExportMenu() {
  const classes = useStyles();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const collapsedOnLoad = useMemo(() => {
    return activeTopic.elements.exportMenu?.collapsedOnLoad || false;
  }, [activeTopic]);
  const [collapsed, setCollapsed] = useState(collapsedOnLoad);
  const [maxCanvasSize, setMaxCanvasSize] = useState(
    parseFloat(localStorage.getItem(LS_SIZE_KEY)),
  );
  const map = useSelector((state) => state.app.map);
  const [exportSelection, setExportSelection] = useState(
    getHighestPossibleRes(maxCanvasSize, map),
  );
  const { t } = useTranslation();

  useEffect(() => {
    const maxCanvasPromise =
      !maxCanvasSize &&
      cancelable(
        canvasSize
          .maxArea({ usePromise: true })
          .then((result) => {
            const size = Math.max(result.width, result.height);
            setMaxCanvasSize(size);
            localStorage.setItem(LS_SIZE_KEY, size);
          })
          // eslint-disable-next-line no-console
          .catch((result) => console.log("Error", result)),
      );
    return () => maxCanvasPromise && maxCanvasPromise.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Open menu item when loading/switching topic
    if (menuOpen) {
      setCollapsed(collapsedOnLoad);
    }
  }, [menuOpen, collapsedOnLoad]);

  const getValue = useCallback(() => {
    return options.find(
      (opt) =>
        opt.resolution === exportSelection.resolution &&
        opt.format === exportSelection.format,
    );
  }, [exportSelection]);

  return (
    <MenuItem
      open
      className="wkp-export-menu"
      title={t("Grossformatiges PDF exportieren")}
      icon={<FaDownload focusable={false} />}
      collapsed={collapsed}
      onCollapseToggle={(c) => setCollapsed(c)}
      fixedHeight={200}
    >
      <div className={classes.menuContent}>
        <div className={classes.selectWrapper}>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.label} id="pdf-format-select-label">
              {t("Format")}
            </InputLabel>
            <Select
              labelId="pdf-format-select-label"
              id="pdf-format-select-label"
              className={classes.input}
              value={getValue()}
              onChange={(evt) =>
                setExportSelection({
                  format: evt.target.value.format,
                  resolution: evt.target.value.resolution,
                })
              }
            >
              {options.map((opt) => {
                return (
                  <MuiMenuItem
                    key={`${opt.format}-${opt.resolution}`}
                    value={opt}
                    disabled={validateOption(
                      `${opt.format}`,
                      opt.resolution,
                      maxCanvasSize,
                      map,
                    )}
                  >
                    {opt.label}
                  </MuiMenuItem>
                );
              })}
            </Select>
          </FormControl>
          <ExportButton
            style={{
              margin: "10px 20px",
              minWidth: 100,
            }}
            exportFormat={exportSelection.format}
            exportScale={exportSelection.resolution}
            exportSize={sizesByFormat[exportSelection.format]}
          />
        </div>
        <div className={classes.infoWrapper}>
          <FaInfoCircle
            focusable={false}
            fontSize="small"
            className={classes.infoIcon}
          />
          <div>
            <Typography variant="subtitle1">
              {t(
                "Die maximal auswählbare dpi hängt von der Browser-Einstellung ab.",
              )}
            </Typography>
            <Typography variant="subtitle1">
              {t(
                "Tipp: Verwenden Sie den Firefox-Browser für den Export hochauflösender Karten.",
              )}
            </Typography>
          </div>
        </div>
      </div>
    </MenuItem>
  );
}

export default React.memo(ExportMenu);
