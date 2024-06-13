import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FaDownload, FaInfoCircle } from "react-icons/fa";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import MenuItem from "../../components/Menu/MenuItem";
import ExportButton from "../../components/ExportButton";
import ExportResolutionSelect from "./ExportResolutionSelect";
import useExportPrintOptions from "../../utils/useExportPrintOptions";
import { sizesByFormat, optionsA0, optionsA1 } from "../../utils/exportUtils";

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
    gap: 15,
  },
  selectResolution: {
    width: 145,
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

const options = [...optionsA0, ...optionsA1];

function ExportMenu() {
  const classes = useStyles();
  const activeTopic = useSelector((state) => state.app.activeTopic);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const collapsedOnLoad = useMemo(() => {
    return activeTopic.elements.exportMenu?.collapsedOnLoad || false;
  }, [activeTopic]);
  const [collapsed, setCollapsed] = useState(collapsedOnLoad);
  const { t } = useTranslation();
  const exportPrintOptions = useExportPrintOptions(options);

  useEffect(() => {
    // Open menu item when loading/switching topic
    if (menuOpen) {
      setCollapsed(collapsedOnLoad);
    }
  }, [menuOpen, collapsedOnLoad]);

  if (!exportPrintOptions) return null;

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
          <ExportResolutionSelect
            options={options}
            className={classes.selectResolution}
          />
          <ExportButton
            exportFormat={exportPrintOptions.paperSize}
            exportScale={exportPrintOptions.quality}
            exportSize={sizesByFormat[exportPrintOptions.paperSize]}
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
