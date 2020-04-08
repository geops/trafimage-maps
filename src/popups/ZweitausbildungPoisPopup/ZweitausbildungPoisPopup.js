import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

import './ZweitausbildungPoisPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
  appBaseUrl: PropTypes.string.isRequired,
};

class ZweitausbildungPoisPopup extends PureComponent {
  // eslint-disable-next-line class-methods-use-this
  highlight(singleFeature, highlight) {
    singleFeature.set('highlight', highlight);
  }

  render() {
    const { feature, t, appBaseUrl } = this.props;
    const features = feature.get('features');

    return (
      <div className="wkp-zweitausbildung-pois-popup">
        {features.map((singleFeature) => (
          <div
            className="wkp-zweitausbildung-pois-popup-row"
            key={singleFeature.get('bezeichnung')}
            onMouseEnter={() => this.highlight(singleFeature, true)}
            onMouseLeave={() => this.highlight(singleFeature, false)}
          >
            <b>{singleFeature.get('bezeichnung')}</b>
            {singleFeature.get('railaway') ? (
              <div className="wkp-zweitausbildung-pois-popup-railaway">
                RailAway
              </div>
            ) : null}
            <div className="wkp-zweitausbildung-pois-popup-image">
              {singleFeature.get('image') ? (
                <img
                  src={`${appBaseUrl}/cached_image?url=${encodeURIComponent(
                    encodeURI(singleFeature.get('image')),
                  )}`}
                  height={
                    singleFeature.get('image_height') *
                    (60 / singleFeature.get('image_height'))
                  }
                  width={
                    singleFeature.get('image_width') *
                    (60 / singleFeature.get('image_height'))
                  }
                  draggable="false"
                  alt={t('Kein Bildtext')}
                />
              ) : null}
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
export default composed;
