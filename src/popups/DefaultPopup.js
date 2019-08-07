import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const DefaultPopup = ({ feature }) => (
  <div className="tm-default-popup">
    {Object.keys(feature.getProperties()).map(key =>
      typeof feature.get(key) === 'object' ? null : (
        <div key={key} className="tm-default-popup-row">
          {key}: {feature.get(key)}
        </div>
      ),
    )}
  </div>
);

DefaultPopup.propTypes = propTypes;

export default DefaultPopup;
