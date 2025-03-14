import React from "react";
import PropTypes from "prop-types";
import { Layer } from "mobility-toolbox-js/ol";
import Feature from "ol/Feature";
import BahnhofplanPopup from "../BahnhofplanPopup";
import NetzkartePopup from "../NetzkartePopup";
import { getId } from "../../utils/removeDuplicateFeatures";

const propTypes = {
  feature: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Feature)),
    PropTypes.instanceOf(Feature),
  ]).isRequired,
  layer: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
    PropTypes.instanceOf(Layer),
  ]).isRequired,
  coordinate: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
};

function StationPopup({ feature, layer, coordinate }) {
  const features = Array.isArray(feature) ? [...feature.reverse()] : [feature];
  const layers = Array.isArray(layer) ? [...layer.reverse()] : [layer];
  const coordinates = Array.isArray((coordinate || [])[0])
    ? [...coordinate.reverse()]
    : [coordinate];

  // if a a station has been clicked, don't show the bahnhohfplans features.
  const isStationClicked = features.find((feat, idx) => {
    return (
      layers[idx].name === "ch.sbb.netzkarte.stationen" ||
      layers[idx].name === "ch.sbb.netzkarte.platforms"
    );
  });

  return (
    <div>
      {features.map((feat, idx) => {
        const displayNetzkartePopup =
          layers[idx].name === "ch.sbb.netzkarte.stationen" ||
          layers[idx].name === "ch.sbb.netzkarte.platforms";
        const key = layers[idx].name + getId(feat);
        if (displayNetzkartePopup) {
          return (
            <NetzkartePopup
              feature={feat}
              key={key}
              layer={layers[idx]}
              coordinate={coordinates[idx]}
            />
          );
        }

        if (isStationClicked) {
          return null;
        }
        return (
          <BahnhofplanPopup
            feature={feat}
            key={key}
            layer={layers[idx]}
            coordinate={coordinates[idx]}
          />
        );
      })}
    </div>
  );
}

StationPopup.propTypes = propTypes;

const memoized = React.memo(StationPopup);

memoized.renderTitle = (feat, layer, t) => {
  const feature = feat.length ? feat[0] : feat;
  const platform = feature.get("platform");
  const isRail = !!feature.get("rail");

  if (platform) {
    return `${feature.get("name")} (${t(isRail ? "abfahrtszeiten_gleis" : "abfahrtszeiten_kante")} ${platform})`;
  }
  return feature.get("name");
};
memoized.hidePagination = true;

export default memoized;
