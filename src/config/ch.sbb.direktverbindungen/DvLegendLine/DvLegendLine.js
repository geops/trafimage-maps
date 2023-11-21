import React from 'react';
import PropTypes from 'prop-types';

function DvLegendLine({ color, width }) {
  return <div style={{ backgroundColor: color, height: 4, width }} />;
}

DvLegendLine.propTypes = {
  color: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DvLegendLine.defaultProps = {
  width: 50,
};

export default DvLegendLine;
