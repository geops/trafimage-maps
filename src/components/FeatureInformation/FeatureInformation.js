import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '@geops/react-ui/components/Button';
import { MdClose } from 'react-icons/md';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { setFeatureInfo } from '../../model/app/actions';
import popups from '../../popups';

import './FeatureInformation.scss';

const propTypes = {
  featureInfo: PropTypes.array.isRequired,
};

const FeatureInformation = ({ featureInfo }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [featureIndex, setFeatureIndex] = useState(0);

  useEffect(() => {
    setFeatureIndex(0);
  }, [featureInfo]);

  const features = featureInfo.map(l => l.features).flat();
  const feature = features[featureIndex];
  if (!feature) {
    return null;
  }

  const info = featureInfo.find(i => i.features.includes(feature));
  if (!info || !info.layer) {
    return null;
  }

  const PopupComponent =
    popups[info.popupComponent || info.layer.get('popupComponent')];
  if (!PopupComponent) {
    return null;
  }

  let pagination = null;
  const { layer } = info;

  if (features.length > 1) {
    pagination = (
      <div className="wkp-pagination-wrapper">
        <span className="wkp-pagination-button-wrapper">
          {featureIndex > 0 ? (
            <Button
              className="wkp-pagination-button"
              title={t('zurück')}
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
              title={t('weiter')}
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
        <div className="wkp-feature-information-header">
          <span>
            {PopupComponent && PopupComponent.renderTitle && feature
              ? PopupComponent.renderTitle(feature, t)
              : layer && layer.getName() && t(layer.getName())}
          </span>
          <Button
            className="wkp-close-bt"
            title={t('Popup schliessen')}
            onClick={() => {
              dispatch(setFeatureInfo([]));
              if (PopupComponent.onCloseBtClick) {
                PopupComponent.onCloseBtClick();
              }
            }}
          >
            <MdClose focusable={false} alt={t('Popup schliessen')} />
          </Button>
        </div>
        <div className="wkp-feature-information-body">
          <PopupComponent
            key={info.layer.getKey()}
            feature={features[featureIndex]}
          />
          {pagination}
        </div>
      </React.Suspense>
    </div>
  );
};

FeatureInformation.propTypes = propTypes;

export default React.memo(FeatureInformation);
