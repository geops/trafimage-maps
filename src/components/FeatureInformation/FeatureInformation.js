/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "@mui/material";
import { setFeatureInfo } from "../../model/app/actions";
import useUpdateFeatureInfoOnLayerToggle from "../../utils/useUpdateFeatureInfoOnLayerToggle";
import useIndexedFeatureInfo from "../../utils/useIndexedFeatureInfo";
import useHighlightLayer from "../../utils/useHighlightLayer";
import getPopupComponent from "../../utils/getPopupComponent";
import "./FeatureInformation.scss";
import CloseButton from "../CloseButton";

function FeatureInformation({ featureInfo }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const appBaseUrl = useSelector((state) => state.app.appBaseUrl);
  const staticFilesUrl = useSelector((state) => state.app.staticFilesUrl);
  const [featureIndex, setFeatureIndex] = useState(0);

  // List of features, layers and coordinates available for pagination.
  const infoIndexed = useIndexedFeatureInfo(featureInfo);

  // Hook to filter out selected features for deactivated layers
  useUpdateFeatureInfoOnLayerToggle(infoIndexed.layers.flat());

  // The current feature(s) to display. Can be an array of an array of features.
  const feature = useMemo(() => {
    return infoIndexed?.features?.[featureIndex];
  }, [featureIndex, infoIndexed?.features]);

  // The current feature(s) to display as an array of features.
  const featuresAsArray = useMemo(() => {
    return Array.isArray(feature) ? feature : [feature];
  }, [feature]);

  // The feature info corresponding to the feature(s) selected.
  const info = useMemo(() => {
    if (!featuresAsArray?.length || !featureInfo) {
      return null;
    }
    return featureInfo?.find((i) => {
      return i.features.includes(featuresAsArray[0]);
    });
  }, [featureInfo, featuresAsArray]);

  // Hook to highlight/select map features
  useHighlightLayer(info, featuresAsArray);

  if (!feature || !info?.layer) {
    if (featureIndex !== 0) {
      setFeatureIndex(0);
    }
    return null;
  }

  const PopupComponent = getPopupComponent(info);
  if (!PopupComponent) {
    return null;
  }

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
          <div className="wkp-feature-information-header" aria-live="assertive">
            <span id="wkp-popup-label">
              {renderTitle
                ? renderTitle(feature, info.layer, t)
                : info.layer.name && t(info.layer.name)}
            </span>
            <CloseButton
              onClick={() => {
                dispatch(setFeatureInfo());
                onCloseBtClick();
              }}
            />
          </div>
        ) : null}
        <div className="wkp-feature-information-body">
          <PopupComponent
            key={info.layer.key}
            t={t}
            layer={layers[featureIndex]} // always an array
            feature={features[featureIndex]} //  can be an array of array of features
            coordinate={coordinates[featureIndex]} // always an array
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
                    title={t("zurück")}
                    onClick={() => setFeatureIndex(featureIndex - 1)}
                    tabIndex="0"
                  >
                    <IoIosArrowRoundBack />
                  </Link>
                )}
              </span>
              {featureIndex + 1} {t("von")} {features.length}
              <span className="wkp-pagination-button-wrapper">
                {featureIndex < features.length - 1 && (
                  <Link
                    className="wkp-pagination-button"
                    title={t("weiter")}
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
