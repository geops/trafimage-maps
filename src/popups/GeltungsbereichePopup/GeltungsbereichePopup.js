import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import geltungsbereicheMapping from '../../utils/geltungsbereicheMapping.json';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const defaultProps = {};

const GeltungsbereichePopup = ({ feature }) => {
  const geltungsbereiche = JSON.parse(feature.get('geltungsbereiche'));
  return (
    <div className="wkp-geltungsbereiche-popup">
      {geltungsbereiche &&
        Object.keys(geltungsbereiche).map((product) => {
          return (
            <React.Fragment key={product}>
              <div>
                <b>{geltungsbereicheMapping[product]}</b>:
                {geltungsbereiche[product].reduce(
                  (providers, provider, idx, arr) =>
                    ` ${providers} ${provider}${
                      idx !== arr.length - 1 ? ',' : ''
                    } `,
                )}
              </div>
              <br />
            </React.Fragment>
          );
        })}
    </div>
  );
};

GeltungsbereichePopup.propTypes = propTypes;
GeltungsbereichePopup.defaultProps = defaultProps;

GeltungsbereichePopup.renderTitle = (f, t) => {
  return t('ch.sbb.geltungsbereiche');
};
export default GeltungsbereichePopup;
