import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../Select';
import { setProjection } from '../../model/app/actions';

import './ProjectionSelect.scss';

const selectStyles = () => {
  return {
    container: () => ({
      position: 'relative',
      height: '30px',
      width: '150px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column-reverse',
      marginRight: '15px',
      color: '#000',
    }),
    control: () => ({
      position: 'relative',
      height: '100%',
      width: '100%',
    }),
    valueContainer: () => ({
      position: 'relative',
      height: 'calc(100% - 10px)',
      width: '100%',
      cursor: 'pointer',
    }),
    indicatorsContainer: () => ({
      display: 'none',
    }),
    menu: (provided, state) => ({
      ...provided,
      width: '100%',
      color: state.selectProps.menuColor,
      border: '1px solid #666',
      borderRadius: 'none',
      borderBottom: '1px solid #e5e5e5',
      position: 'absolute',
      left: '0',
      top: '-153px',
      boxShadow: 'none',
    }),
    option: (styles, state) => ({
      ...styles,
      padding: '10px 15px',
      color: state.isFocused ? '#c60018' : '#000',
      '&:hover': {
        cursor: state.isSelected ? 'default' : 'pointer',
        color: state.isSelected ? '#000' : '#c60018',
      },
      backgroundColor: 'white',
    }),
  };
};

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
  const dispatch = useDispatch();
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobileWidth = useMemo(() => {
    return ['xs', 's'].includes(screenWidth);
  }, [screenWidth]);

  const projection = useSelector((state) => state.app.projection);
  const projectionsOptions = useMemo(() => {
    return projections.map((p) => ({
      label: p.label,
      value: p.value,
    }));
  }, [projections]);

  const onSelectChange = useCallback(
    (opt) => {
      dispatch(setProjection(opt));
    },
    [dispatch],
  );

  if (isMobileWidth) {
    return null;
  }
  return (
    <Select
      options={projectionsOptions}
      value={projection}
      styles={selectStyles()}
      singleValueClassName="wkp-projection-select"
      onChange={onSelectChange}
    />
  );
};

ProjectionSelect.propTypes = propTypes;

export default React.memo(ProjectionSelect);
