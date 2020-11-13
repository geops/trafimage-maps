import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';

function BasicPopup({ feature }) {
  return <div className="wkp-basic-popup">{feature.get('description')}</div>;
}

BasicPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const composed = React.memo(BasicPopup);

composed.renderTitle = (feature) => feature.get('title');
export default composed;
