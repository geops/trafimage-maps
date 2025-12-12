/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import useTranslation from "../../utils/useTranslation";
import { setFeatureInfo } from "../../model/app/actions";
import useUpdateFeatureInfoOnLayerToggle from "../../utils/useUpdateFeatureInfoOnLayerToggle";
import useIndexedFeatureInfo from "../../utils/useIndexedFeatureInfo";
import useHighlightLayer from "../../utils/useHighlightLayer";
import getPopupComponent from "../../utils/getPopupComponent";
import "./FeatureInformation.scss";
import CloseButton from "../CloseButton";
import Pagination from "../Pagination";

function FeatureInformation({ featureInfo }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const appBaseUrl = useSelector((state) => state.app.appBaseUrl);
  const staticFilesUrl = useSelector((state) => state.app.staticFilesUrl);
  const [featureIndex, setFeatureIndex] = useState(0);
  const idd = useId();

  const descIdd = useId();

  // The id creates useID is not a valid selector so we make it
  // valid by replacing colons with underscores
  const id = useMemo(() => idd.replace(/:/g, "_"), [idd]);

  // The id creates useID is not a valid selector so we
  // valid by replacing colons with underscores
  const descId = useMemo(() => descIdd.replace(/:/g, "_"), [descIdd]);

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
      aria-labelledby={id}
      aria-describedby={descId}
      role="dialog"
    >
      <React.Suspense fallback="...loading">
        {!hideHeader ||
        (hideHeader && // For dynamic header rendering (e.g. CASA)
          !hideHeader(feature)) ? (
          <div className="wkp-feature-information-header" aria-live="assertive">
            <span id={id}>
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
            featureInfo={featureInfo} // full featureInfo for context
            coordinate={coordinates[featureIndex]} // always an array
            language={language}
            appBaseUrl={appBaseUrl}
            staticFilesUrl={staticFilesUrl}
            descId={descId}
          />
          {features.length > 1 && (
            <Pagination
              onNext={() => setFeatureIndex((i) => i + 1)}
              onPrevious={() => setFeatureIndex((i) => i - 1)}
              index={featureIndex}
              count={features.length}
            />
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
