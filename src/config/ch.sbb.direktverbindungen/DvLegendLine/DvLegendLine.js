import React from 'react';
import PropTypes from 'prop-types';

const DvLegendLine = ({ color, width }) => {
  return <div style={{ backgroundColor: color, height: 5, width }} />;
};

DvLegendLine.propTypes = {
  color: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DvLegendLine.defaultProps = {
  width: 50,
};

export default DvLegendLine;
