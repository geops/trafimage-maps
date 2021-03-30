import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  fill: PropTypes.string.isRequired,
};

const Square = ({ fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <rect id="rect" data-name="rect" width="20" height="20" fill={fill} />
    </svg>
  );
};

Square.propTypes = propTypes;
export default Square;
