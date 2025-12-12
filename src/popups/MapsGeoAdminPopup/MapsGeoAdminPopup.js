/* eslint-disable react/no-danger */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import useTranslation from "../../utils/useTranslation";
import { getId } from "../../utils/removeDuplicateFeatures";

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

function MapsGeoAdminPopup({ feature }) {
  const [popupHtml, setPopupHtml] = useState(null);
  const featureId = getId(feature);
  const layer = feature.get("layer");
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchHtml = () => {
      fetch(
        `https://api3.geo.admin.ch/rest/services/ech/MapServer/${layer.key}/${featureId}/htmlPopup?&lang=${i18n.language}`,
      )
        .then((res) => res.text())
        .then((text) => {
          const node = document.createElement("div");
          node.innerHTML = text;
          setPopupHtml(node);
        });
    };
    fetchHtml();
  }, [feature, i18n.language, featureId, layer.key]);
  return (
    <div className="wkp-maps-geo-admin-popup">
      {popupHtml && (
        <div
          className="wkp-maps-geo-admin-popup-body"
          dangerouslySetInnerHTML={{
            __html: popupHtml.innerHTML,
          }}
        />
      )}
    </div>
  );
}

MapsGeoAdminPopup.propTypes = propTypes;

const memoized = React.memo(MapsGeoAdminPopup);
memoized.renderTitle = (feat, layer, t) =>
  feat.get("name") || t("Informationen");

export default memoized;
