import React from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { Layer } from 'mobility-toolbox-js/ol';

const propTypes = {
  feature: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Feature)),
    PropTypes.instanceOf(Feature),
  ]).isRequired,
  layer: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
    PropTypes.instanceOf(Layer),
  ]).isRequired,
  coordinate: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
};

const InfrastrukturBetreiberPopup = ({ feature, layer, coordinate }) => {
  return (
    <p>
      {feature.id}
      {layer.id}
      {coordinate}
    </p>
  );
};

InfrastrukturBetreiberPopup.propTypes = propTypes;

export default InfrastrukturBetreiberPopup;
