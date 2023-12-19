import React from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

function CasaRoutePopup({ feature }) {
  const route = feature.get("route");

  return (
    <div className="wkp-casa-route-popup">
      {route.popupContent.map((item) => (
        <div className="wkp-casa-route-popup-row" key={item}>
          <pre>{item}</pre>
        </div>
      ))}
    </div>
  );
}

CasaRoutePopup.propTypes = propTypes;

CasaRoutePopup.hideHeader = (feature) => {
  const route = feature.get("route");
  return !route.popupTitle;
};

CasaRoutePopup.renderTitle = (feature) => {
  const route = feature.get("route");
  return route.popupTitle;
};

export default CasaRoutePopup;
