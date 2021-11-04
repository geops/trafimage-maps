import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  appBaseUrl: PropTypes.string,
  staticFilesUrl: PropTypes.string,
};

const defaultProps = {
  appBaseUrl: null,
  staticFilesUrl: null,
};

const getPopupComponent = ({ popupComponent, layer }) => {
  const comp = popupComponent || layer.get('popupComponent');
  return typeof comp === 'string' ? popups[comp] : comp;
};

const FeatureInformation = ({ featureInfo, appBaseUrl, staticFilesUrl }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const [featureIndex, setFeatureIndex] = useState(0);

  useEffect(() => {
    setFeatureIndex(0);
  }, [featureInfo]);

  // List of features available for pagination.
  const features = [];

  // List of corresponding layer for each features in the array.
  const layers = [];

  // When a popup use hidePagination, we store the index for each popup.
  const indexByPopup = {};

  featureInfo.forEach((featInfo) => {
    const PopupComponent = getPopupComponent(featInfo);
    if (PopupComponent && PopupComponent.hidePagination) {
      const name = PopupComponent.displayName;
      // All features using this PopupComponent will be render on the same page
      if (indexByPopup[name] !== undefined) {
        features[indexByPopup[name]].push(...featInfo.features);
        featInfo.features.forEach(() => {
          if (!layers[indexByPopup[name]]) {
            layers[indexByPopup[name]] = [];
          }
          layers[indexByPopup[name]].push(featInfo.layer);
        });
      } else {
        features.push([...featInfo.features]);
        const arr = [];
        featInfo.features.forEach(() => {
          arr.push(featInfo.layer);
        });
        layers.push(arr);
        indexByPopup[name] = features.length - 1;
      }
    } else if (PopupComponent) {
      features.push(...featInfo.features);
      featInfo.features.forEach(() => {
        layers.push(featInfo.layer);
      });
    }
  });

  // The current feature(s) to display.
  const feature = features[featureIndex];
  if (!feature) {
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

  let pagination = null;
  const { layer } = info;
  const { hideHeader, renderTitle, onCloseBtClick = () => {} } = PopupComponent;

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
                ? renderTitle(feature, t)
                : layer && layer.name && t(layer.name)}
            </span>
            <Button
              className="wkp-close-bt"
              title={t('Popup schliessen')}
              onClick={() => {
                dispatch(setFeatureInfo([]));
                onCloseBtClick();
              }}
            >
              <MdClose focusable={false} alt={t('Popup schliessen')} />
            </Button>
          </div>
        ) : null}
        <div className="wkp-feature-information-body">
          <PopupComponent
            key={info.layer.key}
            t={t}
            layer={layers[featureIndex]}
            feature={features[featureIndex]}
            language={language}
            appBaseUrl={appBaseUrl}
            staticFilesUrl={staticFilesUrl}
          />
          {pagination}
        </div>
      </React.Suspense>
    </div>
  );
};

FeatureInformation.propTypes = propTypes;
FeatureInformation.defaultProps = defaultProps;

export default React.memo(FeatureInformation);
