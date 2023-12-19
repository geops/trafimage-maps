import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import Select from "../Select";
import { setProjection } from "../../model/app/actions";

const useStyles = makeStyles(() => ({
  input: {
    width: 138,
    minWidth: 138,

    "& svg:not(.MuiSelect-iconOpen) + .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
}));

const propTypes = {
  projections: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      format: PropTypes.func.isRequired,
    }),
  ).isRequired,
};

function ProjectionSelect({ projections }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const projection = useSelector((state) => state.app.projection);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobileWidth = useMemo(() => {
    return ["xs", "s"].includes(screenWidth);
  }, [screenWidth]);

  const onSelectChange = useCallback(
    (evt) => {
      dispatch(
        setProjection({
          label: evt.target.value,
          value: evt.target.value,
        }),
      );
    },
    [dispatch],
  );

  if (isMobileWidth) {
    return null;
  }

  return (
    <Select
      value={projection.value}
      onChange={onSelectChange}
      className={classes.input}
      MenuProps={{
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
        },
        PaperProps: {
          style: {
            marginTop: -19,
          },
        },
      }}
    >
      {projections.map((p) => {
        return (
          <MenuItem key={p.value} value={p.value}>
            {t(p.label)}
          </MenuItem>
        );
      })}
    </Select>
  );
}

ProjectionSelect.propTypes = propTypes;

export default React.memo(ProjectionSelect);
