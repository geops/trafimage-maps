import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

import "./HandicapLayerInfo.scss";

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  properties: PropTypes.object.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

const defaultProps = {};

const names = {
  barrierfree: "",
  notBarrierfree: "ch.sbb.nichtbarrierfreierbahnhoefe",
};

const descriptions = {
  de: {
    barrierfree:
      "Ganz oder hauptsächlich barrierefreie Bahnhöfe, an denen das autonome Reisen möglich ist.",
    notBarrierfree: ", an denen autonomes Reisen nicht möglich ist.",
  },
  en: {
    barrierfree:
      "Completely or mainly barrier-free stations where autonomous travel is possible.",
    notBarrierfree: " where autonomous travel is not possible.",
  },
  fr: {
    barrierfree:
      "Gares entièrement ou majoritairement accessibles, où il est possible de se déplacer de manière autonome.",
    notBarrierfree:
      " dans lesquelles il est impossible de se déplacer en toute autonomie.",
  },
  it: {
    barrierfree:
      "Stazioni completamente o parzialmente accessibili, dove è possibile viaggiare in modo autonomo.",
    notBarrierfree: " in cui non è possibile viaggiare in autonomia.",
  },
};

function HandicapLayerInfo({ t, properties, language, staticFilesUrl }) {
  const handicapType = properties.get("handicapType");

  const name = t(names[handicapType]);
  const description = descriptions[language][handicapType];

  const image = (
    <img
      src={`${staticFilesUrl}/img/layers/handicap/${
        handicapType === "barrierfree"
          ? "barrierfreierBahnhoefe"
          : "nichtBarrierfreierBahnhoefe"
      }.png`}
      draggable="false"
      alt={t("Kein Bildtext")}
    />
  );

  return (
    <div className="handicap-layer-info">
      {image}
      <div>
        {name}
        {description}
      </div>
    </div>
  );
}

HandicapLayerInfo.propTypes = propTypes;
HandicapLayerInfo.defaultProps = defaultProps;

export default withTranslation()(HandicapLayerInfo);
