import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const defaultProps = {};

const GeltungsbereichePopup = ({ feature }) => {
  const geltungsbereiche = JSON.parse(feature.get('geltungsbereiche'));
  console.log(feature);
  return (
    <div className="wkp-geltungsbereiche-popup">
      {geltungsbereiche &&
        Object.keys(geltungsbereiche).map((scope) => (
          <React.Fragment key={scope}>
            <div>{scope}</div>
            <br />
          </React.Fragment>
        ))}
    </div>
  );
};

GeltungsbereichePopup.propTypes = propTypes;
GeltungsbereichePopup.defaultProps = defaultProps;

GeltungsbereichePopup.renderTitle = (f, t) => {
  return t('ch.sbb.geltungsbereiche');
};
export default GeltungsbereichePopup;
