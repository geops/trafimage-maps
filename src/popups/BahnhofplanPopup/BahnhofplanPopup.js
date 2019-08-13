import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { FaRegFilePdf } from 'react-icons/fa';

import './BahnhofplanPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

const BahnhofplanPopup = ({ feature, t }) => {
  const iabpUrl = feature.get('url_interactive_plan');
  const a4Url = feature.get('url_a4');
  const posterUrl = feature.get('url_poster');
  const shoppingUrl = feature.get('url_shopping');

  let iabpLink;
  let a4Link;
  let posterLink;
  let shoppingLink;

  if (iabpUrl) {
    iabpLink = (
      <div>
        <a href={iabpUrl} rel="noopener noreferrer" target="_blank">
          {t('Interaktiver Bahnhofplan')}
        </a>
      </div>
    );
  }

  if (a4Url) {
    a4Link = (
      <div>
        <a href={a4Url} rel="noopener noreferrer" target="_blank">
          {t('Format A4')}
          <FaRegFilePdf />
        </a>
      </div>
    );
  }

  if (posterUrl) {
    posterLink = (
      <div>
        <a href={iabpUrl} rel="noopener noreferrer" target="_blank">
          {t('Plakat')}
          <FaRegFilePdf />
        </a>
      </div>
    );
  }

  if (shoppingUrl) {
    shoppingLink = (
      <div>
        <a href={shoppingUrl} rel="noopener noreferrer" target="_blank">
          {t('Shopping')}
          <FaRegFilePdf />
        </a>
      </div>
    );
  }

  return (
    <div className="wkp-bahnhofplan-popup">
      <div className="wkp-bahnhofplan-popup-title">{feature.get('name')}</div>
      {iabpLink}
      {a4Link}
      {posterLink}
      {shoppingLink}
    </div>
  );
};

BahnhofplanPopup.propTypes = propTypes;

export default withTranslation()(BahnhofplanPopup);
