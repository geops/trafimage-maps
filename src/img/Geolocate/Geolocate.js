import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => {
  return {
    geolocIconWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    geolocIconCircle: {
      stroke: (props) => props.color,
      fill: 'transparent',
      strokeWidth: 1,
    },
    geolocIconPoint: {
      fill: (props) => props.color,
    },
  };
});

const Geolocate = ({ onClick, color }) => {
  const classes = useStyles({ color });
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
      onClick={() => onClick()}
      color="currentColor"
    >
      <circle cx="20" cy="20" r="10" className={classes.geolocIconCircle} />
      <circle cx="20" cy="20" r="3" className={classes.geolocIconPoint} />
    </svg>
  );
};

Geolocate.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.string,
};

Geolocate.defaultProps = {
  onClick: () => {},
  color: 'currentColor',
};

export default Geolocate;
