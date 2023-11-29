/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { Link, IconButton } from '@mui/material';
import { setFeatureInfo } from '../../model/app/actions';
import useIndexedFeatureInfo from '../../utils/useIndexedFeatureInfo';
import useHighlightLayer from '../../utils/useHighlightLayer';
import getPopupComponent from '../../utils/getPopupComponent';
import './FeatureInformation.scss';

function FeatureInformation({ featureInfo }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const appBaseUrl = useSelector((state) => state.app.appBaseUrl);
  const staticFilesUrl = useSelector((state) => state.app.staticFilesUrl);
  const highlightLayer = useSelector((state) => state.map.highlightLayer);
  const [featureIndex, setFeatureIndex] = useState(0);

  // List of features and layers available for pagination.
  const infoIndexed = useIndexedFeatureInfo(featureInfo);

  // Hook to highlight map features
  useHighlightLayer(featureInfo, highlightLayer, featureIndex);

  // The current feature(s) to display.
  const feature = infoIndexed.features[featureIndex];
  if (!feature) {
    if (featureIndex !== 0) {
      setFeatureIndex(0);
    }
    return null;
  }

  // Get the feature info corresponding to the feature(s) selected.
  const info = featureInfo.find((i) => {
    if (Array.isArray(feature)) {
      return i.features.includes(feature[0]);
    }
    return i.features.includes(feature);
  });

  if (!info || !info.layer) {
    return null;
  }

  const PopupComponent = getPopupComponent(info);
  if (!PopupComponent) {
    return null;
  }

  const { layer } = info;
  const { layers, features, coordinates } = infoIndexed;
  const { hideHeader, renderTitle, onCloseBtClick = () => {} } = PopupComponent;

  return (
    <div
      className="wkp-feature-information"
      aria-labelledby="wkp-popup-label"
      aria-describedby="wkp-popup-desc"
      role="dialog"
    >
      <React.Suspense fallback="...loading">
        {!hideHeader ||
        (hideHeader && // For dynamic header rendering (e.g. CASA)
          !hideHeader(feature)) ? (
          <div className="wkp-feature-information-header">
            <span id="wkp-popup-label">
              {renderTitle
                ? renderTitle(feature, layer, t)
                : layer && layer.name && t(layer.name)}
            </span>
            <IconButton
              size="medium"
              className="wkp-close-bt"
              title={t('Schliessen')}
              onClick={() => {
                dispatch(setFeatureInfo());
                onCloseBtClick();
              }}
            >
              <MdClose focusable={false} alt={t('Schliessen')} />
            </IconButton>
          </div>
        ) : null}
        <div className="wkp-feature-information-body">
          <PopupComponent
            key={info.layer.key}
            t={t}
            layer={layers[featureIndex]}
            feature={features[featureIndex]}
            coordinate={coordinates[featureIndex]}
            language={language}
            appBaseUrl={appBaseUrl}
            staticFilesUrl={staticFilesUrl}
          />
          {features.length > 1 && (
            <div className="wkp-pagination-wrapper">
              <span className="wkp-pagination-button-wrapper">
                {featureIndex > 0 && (
                  <Link
                    className="wkp-pagination-button"
                    title={t('zurück')}
                    onClick={() => setFeatureIndex(featureIndex - 1)}
                    tabIndex="0"
                  >
                    <IoIosArrowRoundBack />
                  </Link>
                )}
              </span>
              {featureIndex + 1} {t('von')} {features.length}
              <span className="wkp-pagination-button-wrapper">
                {featureIndex < features.length - 1 && (
                  <Link
                    className="wkp-pagination-button"
                    title={t('weiter')}
                    onClick={() => setFeatureIndex(featureIndex + 1)}
                    tabIndex="0"
                  >
                    <IoIosArrowRoundForward />
                  </Link>
                )}
              </span>
            </div>
          )}
        </div>
      </React.Suspense>
    </div>
  );
}

FeatureInformation.propTypes = {
  featureInfo: PropTypes.array.isRequired,
};

export default React.memo(FeatureInformation);
