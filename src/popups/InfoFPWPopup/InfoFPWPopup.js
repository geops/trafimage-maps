import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import Button from 'react-spatial/components/Button';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';

import './InfoFPWPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

class InfoFPWPopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0,
    };
  }

  setImageIndex(index) {
    this.setState({
      imageIndex: index,
    });
  }

  render() {
    const { feature, language, t } = this.props;
    const { imageIndex } = this.state;

    let text;
    let image;
    let pagination;

    const pureText = feature.get(`${language}_text`) || feature.get('de_text');
    if (pureText) {
      // eslint-disable-next-line react/no-danger
      text = <div dangerouslySetInnerHTML={{ __html: pureText }} />;
    }

    const photoPath = feature.get('photo_path');
    if (photoPath) {
      const photoPaths = [JSON.parse(photoPath), JSON.parse(photoPath)].flat();

      if (photoPaths.length) {
        image = (
          <img
            src={`${process.env.REACT_APP_CARTARO_1_URL}/${photoPaths[imageIndex]}`}
            draggable="false"
            alt={t('Kein Bildtext')}
          />
        );
      }

      if (photoPaths.length > 1) {
        pagination = (
          <div className="wkp-pagination-wrapper">
            <span className="wkp-pagination-button-wrapper">
              {imageIndex > 0 ? (
                <Button
                  className="wkp-pagination-button"
                  onClick={() => this.setImageIndex(imageIndex - 1)}
                >
                  <IoIosArrowRoundBack />
                </Button>
              ) : null}
            </span>
            {imageIndex + 1} {t('von')} {photoPaths.length}
            <span className="wkp-pagination-button-wrapper">
              {imageIndex + 1 < photoPaths.length ? (
                <Button
                  className="wkp-pagination-button"
                  onClick={() => this.setImageIndex(imageIndex + 1)}
                >
                  <IoIosArrowRoundForward />
                </Button>
              ) : null}
            </span>
          </div>
        );
      }
    }

    return (
      <div className="wkp-infofpw-popup">
        {text}
        <div className="wkp-infofpw-popup-images">
          {image}
          {pagination}
        </div>
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
