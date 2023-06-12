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
import Point from 'ol/geom/Point';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { Link, IconButton } from '@material-ui/core';
import { setFeatureInfo } from '../../model/app/actions';
import popups from '../../popups';
import highlightPointStyle from '../../utils/highlightPointStyle';
import panCenterFeature from '../../utils/panCenterFeature';

import './FeatureInformation.scss';

const getPopupComponent = ({ popupComponent, layer }) => {
  const comp = popupComponent || layer.get('popupComponent');
  return typeof comp === 'string' ? popups[comp] : comp;
};

const highlightLayer = new VectorLayer({
  source: new VectorSource({ features: [] }),
});
highlightLayer.setStyle(highlightPointStyle);

const FeatureInformation = ({ featureInfo }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const map = useSelector((state) => state.app.map);
  const language = useSelector((state) => state.app.language);
  const searchService = useSelector((state) => state.app.searchService);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const menuOpen = useSelector((state) => state.app.menuOpen);
  const appBaseUrl = useSelector((state) => state.app.appBaseUrl);
  const staticFilesUrl = useSelector((state) => state.app.staticFilesUrl);
  const [featureIndex, setFeatureIndex] = useState(0);

  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);

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

    // List of corresponding coordinates clicked for each features in the array.
    const coordinates = [];

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
              coordinates[indexByPopup[name]] = [];
            }
            if (!coordinates[indexByPopup[name]]) {
              coordinates[indexByPopup[name]] = [];
            }
            layers[indexByPopup[name]].push(featInfo.layer);
            coordinates[indexByPopup[name]].push(featInfo.coordinate);
          });
        } else {
          // At this point features must be displayed in the same popup, that's why we push an array.
          features.push([...featInfo.features]);
          const arr = [];
          const arrCoord = [];
          featInfo.features.forEach(() => {
            arr.push(featInfo.layer);
            arrCoord.push(featInfo.coordinate);
          });
          layers.push(arr);
          coordinates.push(arrCoord);
          indexByPopup[name] = features.length - 1;
        }
      } else if (PopupComponent) {
        features.push(...featInfo.features);
        featInfo.features.forEach(() => {
          layers.push(featInfo.layer);
          coordinates.push(featInfo.coordinate);
        });
      }
    });
    return { features, layers, coordinates };
  }, [featureInfo]);

  // When the featureIndex change we add the red circle then we pan on it.
  useEffect(() => {
    highlightLayer.getSource().clear();

    // 'feature' can be a feature or an array
    const feature = infoIndexed.features[featureIndex];
    if (!feature) {
      // When the user click on map to get new feature info, the infoIndexed is
      // changed before the featureIndex. So the featureIndex is not reinitialized yet.
      // It will be on the next render. So we just ignore if there is no feature to display.
      return;
    }
    const features = Array.isArray(feature) ? feature : [feature];
    const layerr = infoIndexed.layers[featureIndex];
    const layers = Array.isArray(layerr) ? layerr : [layerr];
    const coordinate = infoIndexed.coordinates[featureIndex];
    const coordinates = Array.isArray((coordinate || [])[0])
      ? coordinate
      : [coordinate];

    features.forEach((feat, idx) => {
      if (feat && feat.getGeometry()) {
        if (feat.getGeometry().getType() === GeometryType.POINT) {
          highlightLayer
            .getSource()
            .addFeature(new Feature(feat.getGeometry()));
        } else {
          // In case mapbox render an icon for a polygon or a line we display
          // the highlight style on the coordinate clicked.
          // Needed for platforms layer.
          const { layer } = feat.get('mapboxFeature') || {};
          if (layer && layer.layout && layer.layout['icon-image']) {
            highlightLayer
              .getSource()
              .addFeature(new Feature(new Point(coordinates[idx])));
          }
        }
      }
    });

    // We have to render the map otherwise the last selected features are displayed during animation.
    map.renderSync();

    // We want to recenter the map only if the coordinates clicked are under
    // the Overlay (mobile and desktop) or Menu element (only desktop).
    const coordinateClicked = coordinates[0];
    if (!coordinateClicked) {
      return;
    }
    panCenterFeature(map, layers, coordinateClicked, menuOpen, isMobile);
  }, [map, isMobile, featureIndex, infoIndexed, menuOpen]);

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
};

FeatureInformation.propTypes = {
  featureInfo: PropTypes.array.isRequired,
};

export default React.memo(FeatureInformation);
