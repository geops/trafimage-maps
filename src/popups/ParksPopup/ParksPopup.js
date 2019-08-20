import React from 'react';
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

const ParksPopup = ({ feature, t }) => {
  const parkName = feature.get('park_name');
  const abk = feature.get('abk');
  const parkTyp = feature.get('park_typ');
  const webUrl = feature.get('web');

  let images;
  let typ;
  let web;

  if (abk) {
    const parkImageUrl = `http://www.paerke.ch/bilder/kartenportal/foto_${abk.toLowerCase()}.jpg`;
    const labelLogoUrl = `http://angebote.paerke.ch/export/iframe/label_logo/${abk}`;
    const parkLogoUrl = `http://angebote.paerke.ch/export/iframe/park_logo/${abk}`;

    images = (
      <>
        <img src={parkImageUrl} alt={t('Bild des Parks')} />
        <img src={labelLogoUrl} alt={t('Label des Parks')} />
        <img src={parkLogoUrl} alt={t('Logo des Parks')} />
      </>
    );
  }

  if (parkTyp) {
    typ = <div>{t(parkTyp)}</div>;
  }

  if (webUrl) {
    const protocol = 'http://';
    const url = webUrl.indexOf(protocol) > -1 ? webUrl : `${protocol}${webUrl}`;

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
};

const mapStateToProps = state => ({
  language: state.app.language,
});

ParksPopup.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(ParksPopup);
