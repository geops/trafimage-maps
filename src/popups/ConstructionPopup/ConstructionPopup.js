import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import Link from '../../components/Link';

import './ConstructionPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

const ConstructionPopup = ({ feature, t, className }) => {
  let projektort;
  let ort;
  let artAndOrt;
  let link1;
  let link2;
  let link3;

  if (feature.get('projektort')) {
    projektort = (
      <div className="wkp-construction-popup-subtitle">
        {t(feature.get('projektort'))}
      </div>
    );
  }

  if (feature.get('ort')) {
    ort = <span>({t(feature.get('ort'))})</span>;
  }

  if (feature.get('art')) {
    artAndOrt = (
      <div className="wkp-construction-popup-desc">
        <span>{t(feature.get('art'))}</span> {ort}
      </div>
    );
  }

  if (feature.get('link1_title') && feature.get('link1')) {
    link1 = (
      <div className="wkp-construction-popup-link">
        <Link href={feature.get('link1')}>{t(feature.get('link1_title'))}</Link>
      </div>
    );
  }

  if (feature.get('link2_title') && feature.get('link2')) {
    link2 = (
      <div className="wkp-construction-popup-link">
        <Link href={feature.get('link2')}>{t(feature.get('link2_title'))}</Link>
      </div>
    );
  }

  if (feature.get('link3_title') && feature.get('link3')) {
    link3 = (
      <div className="wkp-construction-popup-link">
        <Link href={feature.get('link3')}>{t(feature.get('link3_title'))}</Link>
      </div>
    );
  }

  return (
    <div className={`${className} wkp-construction-popup`}>
      {projektort}
      {artAndOrt}
      {link1}
      {link2}
      {link3}
    </div>
  );
};

ConstructionPopup.propTypes = propTypes;
ConstructionPopup.defaultProps = defaultProps;

const composed = compose(withTranslation())(ConstructionPopup);

composed.renderTitle = feat => feat.get('name');
export default composed;
