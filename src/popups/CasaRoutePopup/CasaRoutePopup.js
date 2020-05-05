import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const CasaRoutePopup = ({ feature }) => {
  const content = feature.get('route').popupContent;

  return (
    <div className="wkp-casa-route-popup">
      {Object.keys(content).map((key) => (
        <div className="wkp-casa-route-popup-row" key={key}>
          {key}: {content[key]}
        </div>
      ))}
    </div>
  );
};

CasaRoutePopup.propTypes = propTypes;

CasaRoutePopup.renderTitle = (feature) => {
  const route = feature.get('route');
  return route.popupTitle || 'Informationen';
};

export default CasaRoutePopup;
