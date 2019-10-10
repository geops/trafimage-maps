import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-spatial/components/Button';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import './FeatureInformation.scss';

const propTypes = {
  clickedFeatureInfo: PropTypes.array.isRequired,
  popupComponents: PropTypes.objectOf(PropTypes.string).isRequired,
};

const FeatureInformation = ({ clickedFeatureInfo, popupComponents }) => {
  const { t } = useTranslation();
  const [featureIndex, setFeatureIndex] = useState(0);
  const features = clickedFeatureInfo.map(l => l.features).flat();
  const feature = features[featureIndex];
  const info = clickedFeatureInfo.find(i => i.features.includes(feature));

  useEffect(() => {
    setFeatureIndex(0);
  }, [clickedFeatureInfo]);

  // Styleguidist try to load every file in the folder if we don't put index.js
  const PopupComponent = React.lazy(() =>
    import(`../../popups/${popupComponents[info.layer.getKey()]}/index.js`),
  );

  const MemoizedPopupComponent = React.memo(PopupComponent);

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
        <MemoizedPopupComponent feature={features[featureIndex]} />
        {pagination}
      </React.Suspense>
    </div>
  );
};

FeatureInformation.propTypes = propTypes;

export default FeatureInformation;
