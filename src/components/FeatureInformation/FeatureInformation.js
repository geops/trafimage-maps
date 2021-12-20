/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import GeometryType from 'ol/geom/GeometryType';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { Link, IconButton } from '@material-ui/core';
import { setFeatureInfo } from '../../model/app/actions';
import popups from '../../popups';
import highlightPointStyle from '../../utils/highlightPointStyle';

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

const highlightLayer = new VectorLayer({
  source: new VectorSource({ features: [] }),
});
highlightLayer.setStyle(highlightPointStyle);

const FeatureInformation = ({ featureInfo, appBaseUrl, staticFilesUrl }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const map = useSelector((state) => state.app.map);
  const language = useSelector((state) => state.app.language);
  const searchService = useSelector((state) => state.app.searchService);
  const [featureIndex, setFeatureIndex] = useState(0);

  useEffect(() => {
    // The featureInformation component can be display twice at the same time (in the popup and in the overlay).
    // So to avoid a js error we have to check if the layer is already on the map or not.
    if (
      map &&
      !map
        .getLayers()
        .getArray()
        .find((layer) => layer === highlightLayer)
    ) {
      map.addLayer(highlightLayer);
      // Clear the highlight for search
      if (searchService) {
        searchService.clearHighlight();
      }
    }

    return () => {
      highlightLayer.getSource().clear();

      if (
        map &&
        map
          .getLayers()
          .getArray()
          .find((layer) => layer === highlightLayer)
      ) {
        map.removeLayer(highlightLayer);
      }
    };
  }, [map, searchService]);

  useEffect(() => {
    setFeatureIndex(0);
  }, [featureInfo]);

  // List of features and layers available for pagination.
  const infoIndexed = useMemo(() => {
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
          // At this point features must be displaye din the same popup, that's why we push an array.
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
    return { features, layers };
  }, [featureInfo]);

  useEffect(() => {
    highlightLayer.getSource().clear();

    // When the featureIndex change we addd the red circle.
    const feature = infoIndexed.features[featureIndex];
    // 'feature' can be a feature or an array
    (Array.isArray(feature) ? feature : [feature]).forEach((feat) => {
      if (
        feat &&
        feat.getGeometry() &&
        feat.getGeometry().getType() === GeometryType.POINT
      ) {
        highlightLayer.getSource().addFeature(new Feature(feat.getGeometry()));
      }
    });
  }, [featureIndex, featureInfo, infoIndexed]);

  // The current feature(s) to display.
  const feature = infoIndexed.features[featureIndex];
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

  const { layer } = info;
  const { layers, features } = infoIndexed;
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
                ? renderTitle(feature, t)
                : layer && layer.name && t(layer.name)}
            </span>
            <IconButton
              className="wkp-close-bt"
              title={t('Popup schliessen')}
              onClick={() => {
                dispatch(setFeatureInfo([]));
                onCloseBtClick();
              }}
            >
              <MdClose focusable={false} alt={t('Popup schliessen')} />
            </IconButton>
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
};

FeatureInformation.propTypes = propTypes;
FeatureInformation.defaultProps = defaultProps;

export default React.memo(FeatureInformation);
