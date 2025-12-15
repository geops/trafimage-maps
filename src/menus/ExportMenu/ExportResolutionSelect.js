import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { MenuItem, InputLabel, FormControl } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useTranslation from "../../utils/useTranslation";
import Select from "../../components/Select";
import { validateOption } from "../../utils/exportUtils";
import { setExportPrintOptions } from "../../model/app/actions";
import useMaxCanvasSize from "../../utils/useMaxCanvasSize";
import useExportPrintOptions from "../../utils/useExportPrintOptions";

const useStyles = makeStyles(() => ({
  label: {
    top: -8,
    left: -12,
  },
}));

function ExportResolutionSelect({ options, className = "" }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const map = useSelector((state) => state.app.map);
  const maxCanvasSize = useMaxCanvasSize();
  const exportPrintOptions = useExportPrintOptions(options);
  const [value, setValue] = useState(exportPrintOptions);

  useEffect(() => {
    if (exportPrintOptions) {
      setValue(
        options.find(
          (opt) =>
            opt.quality === exportPrintOptions.quality &&
            opt.paperSize === exportPrintOptions.paperSize,
        ),
      );
    }
  }, [exportPrintOptions, options]);

  if (!exportPrintOptions || !value) return null;

  return (
    <FormControl className={className}>
      <InputLabel className={classes.label}>{t("Format")}</InputLabel>
      <Select
        className={classes.input}
        value={value}
        onChange={(evt) => dispatch(setExportPrintOptions(evt.target.value))}
      >
        {options.map((opt) => {
          return (
            <MenuItem
              key={`${opt.paperSize}-${opt.quality}`}
              value={opt}
              disabled={validateOption(
                `${opt.paperSize}`,
                opt.quality,
                maxCanvasSize,
                map,
              )}
            >
              {opt.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

ExportResolutionSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      paperSize: PropTypes.string.isRequired,
      quality: PropTypes.number.isRequired,
    }),
  ).isRequired,
  className: PropTypes.string,
};

export default ExportResolutionSelect;
