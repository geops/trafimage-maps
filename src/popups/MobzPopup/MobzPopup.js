import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

const MobzPopup = ({ feature, t }) => {
  const category = feature.get('kategorisierung');

  return (
    <div className="wkp-mobz-popup">
      <img
        alt={t(category)}
        src={`${process.env.REACT_APP_STATIC_FILES_URL}/img/layers/mobz/${category}.png`}
      />
      <span>{t(category)}</span>
    </div>
  );
};

MobzPopup.propTypes = propTypes;

const composed = compose(withTranslation())(MobzPopup);

composed.renderTitle = feat => feat.get('name');
export default composed;
