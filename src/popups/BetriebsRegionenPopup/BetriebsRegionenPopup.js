import React, { memo } from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";

const propTypes = {
  language: PropTypes.string.isRequired,
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const regions = {
  "Region West": {
    de: "West",
    en: "West",
    it: "Ovest",
    fr: "Ouest",
  },
  "Region Mitte": {
    de: "Mitte",
    en: "Center",
    it: "Centro",
    fr: "Centre",
  },
  "Region Süd": {
    de: "Süd",
    en: "South",
    it: "Sud",
    fr: "Sud",
  },
  "Region Ost": {
    de: "Ost",
    en: "East",
    it: "Est",
    fr: "Est",
  },
  "Andere ISB BLS": {
    de: "BLS",
    en: "BLS",
    it: "BLS",
    fr: "BLS",
  },
  "Andere ISB SOB": {
    de: "SOB",
    en: "SOB",
    it: "SOB",
    fr: "SOB",
  },
};

function BetriebsRegionenPopup({ language, feature }) {
  const regionName = feature.get("region");
  if (!regions[regionName]) {
    return null;
  }
  return (
    <div>
      <span>{regions[regionName][language]}</span>
    </div>
  );
}

BetriebsRegionenPopup.propTypes = propTypes;
export default memo(BetriebsRegionenPopup);
