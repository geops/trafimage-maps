import React from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import { withTranslation } from "react-i18next";
import DeparturePopupContent from "./DeparturePopupContent";

function DeparturePopup({ feature, children }) {
  const platform = feature.get("platform");
  const uic = parseFloat(feature.get("sbb_id"));

  return (
    <DeparturePopupContent uic={uic} platform={platform} showTitle>
      {children}
    </DeparturePopupContent>
  );
}

DeparturePopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  children: PropTypes.node,
};
DeparturePopup.defaultProps = { children: undefined };

const composed = withTranslation()(DeparturePopup);
composed.renderTitle = (feat, layer, t) => {
  const platform = feat.get("platform");
  if (platform) {
    return `${feat.get("name")} (${t("abfahrtszeiten_kante")} ${platform})`;
  }
  return feat.get("name");
};

export default composed;
