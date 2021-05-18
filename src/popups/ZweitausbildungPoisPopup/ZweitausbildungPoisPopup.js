import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import ZweitausbildungPoisLayer from '../../layers/ZweitausbildungPoisLayer';

import './ZweitausbildungPoisPopup.scss';

const propTypes = {
  feature: PropTypes.arrayOf(PropTypes.instanceOf(Feature)).isRequired,
  layer: PropTypes.instanceOf(ZweitausbildungPoisLayer).isRequired,
  t: PropTypes.func.isRequired,
};

class ZweitausbildungPoisPopup extends PureComponent {
  render() {
    const { feature, layer, t } = this.props;
    return (
      <div className="wkp-zweitausbildung-pois-popup">
        {feature.map((feat) => (
          <div
            className="wkp-zweitausbildung-pois-popup-row"
            key={feat.get('name')}
            onMouseEnter={() => layer.highlightFromPopup(feat, true)}
            onMouseLeave={() => layer.highlightFromPopup(feat, false)}
          >
            <b>{feat.get('name')}</b>
            {!!feat.get('rail_away') && (
              <div className="wkp-zweitausbildung-pois-popup-railaway">
                RailAway
              </div>
            )}
            <div className="wkp-zweitausbildung-pois-popup-image">
              {!!feat.get('foto') && (
                <img
                  src={feat.get('foto')}
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
