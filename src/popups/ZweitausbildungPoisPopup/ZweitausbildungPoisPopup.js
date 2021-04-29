import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import ZweitausbildungPoisLayer from '../../layers/ZweitausbildungPoisLayer';

import './ZweitausbildungPoisPopup.scss';

const propTypes = {
  features: PropTypes.arrayOf(PropTypes.instanceOf(Feature)).isRequired,
  layer: PropTypes.instanceOf(ZweitausbildungPoisLayer).isRequired,
  t: PropTypes.func.isRequired,
};

class ZweitausbildungPoisPopup extends PureComponent {
  render() {
    const { features, layer, t } = this.props;
    return (
      <div className="wkp-zweitausbildung-pois-popup">
        {features.map((feature) => (
          <div
            className="wkp-zweitausbildung-pois-popup-row"
            key={feature.get('name')}
            onMouseEnter={() => layer.highlightFromPopup(feature, true)}
            onMouseLeave={() => layer.highlightFromPopup(feature, false)}
          >
            <b>{feature.get('name')}</b>
            {!!feature.get('rail_away') && (
              <div className="wkp-zweitausbildung-pois-popup-railaway">
                RailAway
              </div>
            )}
            <div className="wkp-zweitausbildung-pois-popup-image">
              {!!feature.get('foto') && (
                <img
                  src={feature.get('foto')}
                  draggable="false"
                  alt={t('Kein Bildtext')}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

ZweitausbildungPoisPopup.propTypes = propTypes;

const composed = compose(withTranslation())(ZweitausbildungPoisPopup);

composed.renderTitle = (feature, t) => t('Detailinformationen');
composed.hidePagination = true;
export default composed;
