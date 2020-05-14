import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';

import './KilometragePopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

const KilometragePopup = ({ feature, t }) => {
  return (
    <div className="wkp-kilometrage-popup">
      <div className="wkp-popup-row">
        {`${t('DfA Linien Nr.')}: ${feature.get('linie')}`}
      </div>
      <div className="wkp-popup-row">
        {`${t('Kilometer')}: ${Number(feature.get('clicked_km')).toFixed(2)}`}
      </div>
    </div>
  );
};

KilometragePopup.propTypes = propTypes;

const memoized = React.memo(KilometragePopup);
memoized.hideHeader = true;

export default memoized;
