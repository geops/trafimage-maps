import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Select from '../Select';
import { setProjection } from '../../model/app/actions';

const useStyles = makeStyles((theme) => ({
  input: {
    width: 130,
    minWidth: 130,
  },
  select: {
    padding: '10px 14px !important',
  },
  menuItem: {
    paddingLeft: 12,
    fontSize: theme.typography.fontSize,
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

const ProjectionSelect = ({ projections }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobileWidth = useMemo(() => {
    return ['xs', 's'].includes(screenWidth);
  }, [screenWidth]);

  const projection = useSelector((state) => state.app.projection);
  const projectionsOptions = useMemo(() => {
    return projections.map((p) => {
      return (
        <MenuItem key={p.value} value={p.value} className={classes.menuItem}>
          {t(p.label)}
        </MenuItem>
      );
    });
  }, [projections, t, classes]);

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
      hideOutline
      value={projection.value}
      onChange={onSelectChange}
      className={classes.input}
      classes={{ outlined: classes.select }}
      MenuProps={{
        PaperProps: {
          style: {
            borderTop: `1px solid #888`,
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            marginTop: -19,
          },
        },
      }}
      variant="outlined"
    >
      {projectionsOptions}
    </Select>
  );
};

ProjectionSelect.propTypes = propTypes;

export default React.memo(ProjectionSelect);
