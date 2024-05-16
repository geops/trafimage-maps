import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import AusbauLayer from "../../layers/AusbauLayer";
import { updateConstructions } from "../../config/ch.sbb.construction";

const useStyles = makeStyles(() => ({
  formControl: {
    marginTop: 10,
    marginBottom: 20,
    flex: "auto",
    marginRight: "22px",
  },
}));

const propTypes = {
  layer: PropTypes.instanceOf(AusbauLayer),
};

const defaultProps = {
  layer: null,
};

function AusbauFilters({ layer }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = useState((layer && layer.filter.value) || "");

  const onChange = useCallback(
    (evt) => {
      const newValue = evt.target.value;
      setValue(newValue);
      layer.applyNewFilter(newValue);
      updateConstructions(layer.mapboxLayer.maplibreMap);
    },
    [layer, setValue],
  );

  if (!layer || typeof layer.showFilterParam !== "string") {
    return null;
  }

  return (
    <FormControl fullWidth className={classes.formControl}>
      <InputLabel shrink>{t("angebotsschritt")}</InputLabel>
      <Select
        autoWidth
        displayEmpty
        value={value}
        onChange={onChange}
        classes={{ icon: classes.selectIcon }}
      >
        {layer.filters.map((filter) => {
          return (
            <MenuItem value={filter.value} key={filter.key}>
              {t(filter.key)}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

AusbauFilters.propTypes = propTypes;
AusbauFilters.defaultProps = defaultProps;

export default AusbauFilters;
