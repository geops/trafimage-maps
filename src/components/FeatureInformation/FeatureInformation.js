import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-spatial/components/Button';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import popups from '../../popups';

import './FeatureInformation.scss';

const propTypes = {
  clickedFeatureInfo: PropTypes.array.isRequired,
};

const FeatureInformation = ({ clickedFeatureInfo }) => {
  const { t } = useTranslation();
  const [featureIndex, setFeatureIndex] = useState(0);
  const features = clickedFeatureInfo.map(l => l.features).flat();
  const feature = features[featureIndex];
  const info = clickedFeatureInfo.find(i => i.features.includes(feature));
  const PopupComponent = popups[info.layer.get('popupComponent')];

  useEffect(() => {
    setFeatureIndex(0);
  }, [clickedFeatureInfo]);

  if (!feature || !PopupComponent) {
    return null;
  }

  let pagination = null;

  if (features.length > 1) {
    pagination = (
      <div className="wkp-pagination-wrapper">
        <span className="wkp-pagination-button-wrapper">
          {featureIndex > 0 ? (
            <Button
              className="wkp-pagination-button"
              onClick={() => setFeatureIndex(featureIndex - 1)}
            >
              <IoIosArrowRoundBack />
            </Button>
          ) : null}
        </span>
        {featureIndex + 1} {t('von')} {features.length}
        <span className="wkp-pagination-button-wrapper">
          {featureIndex + 1 < features.length ? (
            <Button
              className="wkp-pagination-button"
              onClick={() => setFeatureIndex(featureIndex + 1)}
            >
              <IoIosArrowRoundForward />
            </Button>
          ) : null}
        </span>
      </div>
    );
  }

  return (
    <div className="wkp-feature-information">
      <React.Suspense fallback="...loading">
        <PopupComponent
          key={info.layer.getKey()}
          feature={features[featureIndex]}
        />
        {pagination}
      </React.Suspense>
    </div>
  );
};

FeatureInformation.propTypes = propTypes;

export default React.memo(FeatureInformation);
