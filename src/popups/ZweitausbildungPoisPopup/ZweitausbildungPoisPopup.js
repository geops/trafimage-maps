import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

import './ZweitausbildungPoisPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

class ZweitausbildungPoisPopup extends PureComponent {
  highlight(singleFeature, highlight) {
    const { feature } = this.props;

    singleFeature.set('highlight', highlight);
    feature.changed();
  }

  render() {
    const { feature, t } = this.props;
    const features = feature.get('features');

    return (
      <div className="wkp-zweitausbildung-pois-popup">
        {features.map(singleFeature => (
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
                  src={`${
                    process.env.REACT_APP_BASE_URL
                  }/cached_image?url=${encodeURIComponent(
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

export default compose(withTranslation())(ZweitausbildungPoisPopup);
