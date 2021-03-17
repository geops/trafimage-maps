import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import ZweitausbildungPoisLayer from '../../layers/ZweitausbildungPoisLayer';

import './ZweitausbildungPoisPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(ZweitausbildungPoisLayer).isRequired,
  t: PropTypes.func.isRequired,
};

class ZweitausbildungPoisPopup extends PureComponent {
  render() {
    const { feature, layer, t } = this.props;
    const { name, rail_away: railAway, foto } = feature.getProperties() || {};
    return (
      <div className="wkp-zweitausbildung-pois-popup">
        <div
          className="wkp-zweitausbildung-pois-popup-row"
          key={name}
          onMouseEnter={() => layer.highlightFromPopup(feature, true)}
          onMouseLeave={() => layer.highlightFromPopup(feature, false)}
        >
          <b>{name}</b>
          {!!railAway && (
            <div className="wkp-zweitausbildung-pois-popup-railaway">
              RailAway
            </div>
          )}
          <div className="wkp-zweitausbildung-pois-popup-image">
            {!!foto && (
              <img src={foto} draggable="false" alt={t('Kein Bildtext')} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

ZweitausbildungPoisPopup.propTypes = propTypes;

const composed = compose(withTranslation())(ZweitausbildungPoisPopup);

composed.renderTitle = (feature, t) => t('Detailinformationen');
export default composed;
