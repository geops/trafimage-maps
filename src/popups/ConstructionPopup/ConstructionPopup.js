import React from "react";
import PropTypes from "prop-types";
import Feature from "ol/Feature";
import Link from "../../components/Link";

import "./ConstructionPopup.scss";
import useTranslation from "../../utils/useTranslation";

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const defaultProps = {};

const capitalize = (stg) => `${stg.charAt(0).toUpperCase()}${stg.slice(1)}`;

function ConstructionPopup({ feature }) {
  const { t } = useTranslation();
  let projektort;
  let ort;
  let artAndOrt;
  let link1;
  let link2;
  let link3;

  if (feature.get("projektort")) {
    projektort = (
      <div className="wkp-construction-popup-subtitle">
        {t(feature.get("projektort"))}
      </div>
    );
  }

  if (feature.get("ort")) {
    ort = <span>({t(capitalize(feature.get("ort")))})</span>;
  }

  if (feature.get("art")) {
    artAndOrt = (
      <div className="wkp-construction-popup-desc">
        <span>{t(capitalize(feature.get("art")))}</span> {ort}
      </div>
    );
  }

  if (feature.get("link1_title") && feature.get("link1_url")) {
    link1 = (
      <div className="wkp-construction-popup-link">
        <Link href={feature.get("link1_url")}>
          {t(feature.get("link1_title"))}
        </Link>
      </div>
    );
  }

  if (feature.get("link2_title") && feature.get("link2_url")) {
    link2 = (
      <div className="wkp-construction-popup-link">
        <Link href={feature.get("link2_url")}>
          {t(feature.get("link2_title"))}
        </Link>
      </div>
    );
  }

  if (feature.get("link3_title") && feature.get("link3_url")) {
    link3 = (
      <div className="wkp-construction-popup-link">
        <Link href={feature.get("link3_url")}>
          {t(feature.get("link3_title"))}
        </Link>
      </div>
    );
  }

  return (
    <div className="wkp-construction-popup">
      {projektort}
      {artAndOrt}
      {link1}
      {link2}
      {link3}
    </div>
  );
}

ConstructionPopup.propTypes = propTypes;
ConstructionPopup.defaultProps = defaultProps;

const composed = ConstructionPopup;

composed.renderTitle = (feat) => feat.get("projektname");
export default composed;
