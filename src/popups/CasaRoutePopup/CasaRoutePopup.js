import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const CasaRoutePopup = ({ feature }) => (
  <div>Route: {feature.get('station_from').name}</div>
);

CasaRoutePopup.propTypes = propTypes;

export default CasaRoutePopup;
