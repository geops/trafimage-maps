import React from 'react';
import PropTypes from 'prop-types';
import { Layer } from 'mobility-toolbox-js/ol';
import Feature from 'ol/Feature';
import BahnhofplanPopup from '../BahnhofplanPopup';
import NetzkartePopup from '../NetzkartePopup';

const propTypes = {
  feature: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Feature)),
    PropTypes.instanceOf(Feature),
  ]).isRequired,
  layer: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
    PropTypes.instanceOf(Layer),
  ]).isRequired,
};

function StationPopup({ feature, layer }) {
  const features = feature.length ? [...feature.reverse()] : [feature];
  const layers = layer.length ? [...layer.reverse()] : [layer];

  return (
    <div className="wkp-station-popup">
      {features.map((feat, idx) => {
        const displayNetzkartePopup =
          layers[idx].name === 'ch.sbb.netzkarte.stationen';
        const key = layers[idx].name + feat.getId();
        if (displayNetzkartePopup) {
          return <NetzkartePopup feature={feat} key={key} />;
        }
        return <BahnhofplanPopup feature={feat} key={key} />;
      })}
    </div>
  );
}

StationPopup.propTypes = propTypes;

const memoized = React.memo(StationPopup);
memoized.renderTitle = (feat) => (feat.length ? feat[0] : feat).get('name');
memoized.hidePagination = true;

export default memoized;
