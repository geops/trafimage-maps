import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';

import './ParksPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

class ParksPopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const { feature } = this.props;
    const abk = feature.get('abk');

    if (abk) {
      this.parkImageUrl = `http://www.paerke.ch/bilder/kartenportal/foto_${abk.toLowerCase()}.jpg`;
      this.labelLogoUrl = `http://angebote.paerke.ch/export/iframe/label_logo/${abk}`;
      this.parkLogoUrl = `http://angebote.paerke.ch/export/iframe/park_logo/${abk}`;

      this.preload([this.parkImageUrl, this.labelLogoUrl, this.parkLogoUrl]);
    }
  }

  preload(urls) {
    Promise.all(
      urls.map(url => {
        return new Promise(resolve => {
          const image = new Image();
          image.onload = resolve;
          image.src = url;
        });
      }),
    ).then(() => {
      this.setState({ loaded: true });
    });
  }

  render() {
    const { feature, t } = this.props;
    const { loaded } = this.state;

    const parkName = feature.get('park_name');
    const parkTyp = feature.get('park_typ');
    const webUrl = feature.get('web');

    let images;
    let typ;
    let web;

    if (loaded) {
      images = (
        <>
          <img src={this.parkImageUrl} alt={t('Bild des Parks')} />
          <img src={this.labelLogoUrl} alt={t('Label des Parks')} />
          <img src={this.parkLogoUrl} alt={t('Logo des Parks')} />
        </>
      );
    }

    if (parkTyp) {
      typ = <div>{t(parkTyp)}</div>;
    }

    if (webUrl) {
      const protocol = 'http://';
      const url =
        webUrl.indexOf(protocol) > -1 ? webUrl : `${protocol}${webUrl}`;

      web = (
        <a href={url} rel="noopener noreferrer" target="_blank">
          {t('Webseite des Parks')}
        </a>
      );
    }

    return (
      <div className="wkp-parks-popup">
        <div className="wkp-parks-popup-title">{parkName}</div>
        {images}
        {typ}
        {web}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  language: state.app.language,
});

ParksPopup.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(ParksPopup);
