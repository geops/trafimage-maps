import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

const CasaRoutePopup = ({ feature, className }) => (
  <div className={className}>Route: {feature.get('station_from').name}</div>
);

CasaRoutePopup.propTypes = propTypes;
CasaRoutePopup.defaultProps = defaultProps;

export default CasaRoutePopup;
