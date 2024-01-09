import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { MenuItem, InputLabel, FormControl } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../components/Select";
import { validateOption } from "../../utils/exportUtils";
import { setExportSelection } from "../../model/app/actions";
import useMaxCanvasSize from "../../utils/useMaxCanvasSize";
import useExportSelection from "../../utils/useExportSelection";

const useStyles = makeStyles(() => ({
  label: {
    top: -8,
    left: -12,
  },
}));

function ExportResolutionSelect({ options, className }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const map = useSelector((state) => state.app.map);
  const maxCanvasSize = useMaxCanvasSize();
  const exportSelection = useExportSelection(options);
  const [value, setValue] = useState(exportSelection);

  useEffect(() => {
    if (exportSelection) {
      setValue(
        options.find(
          (opt) =>
            opt.resolution === exportSelection.resolution &&
            opt.format === exportSelection.format,
        ),
      );
    }
  }, [exportSelection, options]);

  if (!exportSelection || !value) return null;

  return (
    <FormControl fullWidth className={className}>
      <InputLabel className={classes.label} id="pdf-format-select-label">
        {t("Format")}
      </InputLabel>
      <Select
        labelId="pdf-format-select-label"
        id="pdf-format-select-label"
        className={classes.input}
        value={value}
        onChange={(evt) =>
          dispatch(
            setExportSelection({
              format: evt.target.value.format,
              resolution: evt.target.value.resolution,
            }),
          )
        }
      >
        {options.map((opt) => {
          return (
            <MenuItem
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
      format: PropTypes.string.isRequired,
      resolution: PropTypes.number.isRequired,
    }),
  ).isRequired,
  className: PropTypes.string,
};

ExportResolutionSelect.defaultProps = {
  className: "",
};

export default ExportResolutionSelect;
