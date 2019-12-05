import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import { Fade } from 'react-slideshow-image';

import './InfoFPWPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

class InfoFPWPopup extends PureComponent {
  render() {
    const { feature, language, t } = this.props;

    let text;
    let images;

    const pureText = feature.get(`${language}_text`) || feature.get('de_text');
    if (pureText) {
      // eslint-disable-next-line react/no-danger
      text = <div dangerouslySetInnerHTML={{ __html: pureText }} />;
    }

    const photoPath = feature.get('photo_path');
    if (photoPath) {
      const photoPaths = JSON.parse(photoPath);

      if (photoPaths.length) {
        images = (
          <Fade
            duration="500"
            transitionDuration="500"
            arrows={photoPaths.length > 1}
            indicators={photoPaths.length > 1}
            autoplay={false}
          >
            {photoPaths.map(url => (
              <img
                src={`${process.env.REACT_APP_CARTARO_1_URL}/${url}`}
                draggable="false"
                alt={t('Kein Bildtext')}
              />
            ))}
          </Fade>
        );
      }
    }

    return (
      <div className="wkp-infofpw-popup">
        {text}
        <div className="wkp-infofpw-popup-images">{images}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  language: state.app.language,
});

InfoFPWPopup.propTypes = propTypes;
InfoFPWPopup.defaultProps = defaultProps;

const composed = compose(
  withTranslation(),
  connect(mapStateToProps),
)(InfoFPWPopup);

composed.renderTitle = feat => feat.get('name');
export default composed;
