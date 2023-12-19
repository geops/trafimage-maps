import React from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";

function DrawPopup({ feature }) {
  const descr = feature.get("description");
  if (!descr) {
    return null;
  }

  return (
    <div
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: descr }}
    />
  );
}

DrawPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const composed = React.memo(DrawPopup);

composed.renderTitle = (feature) => feature.get("name");
export default composed;
