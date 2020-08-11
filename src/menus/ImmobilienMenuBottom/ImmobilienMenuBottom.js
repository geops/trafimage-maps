import React from 'react';
import PropTypes from 'prop-types';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import SelectFilter from '../../components/SelectFilter';

const propTypes = {
  topic: PropTypes.shape().isRequired,
};

const filters = {
  Alle: undefined,
  'ch.sbb.stuetzpunktbahnhoefe': ['all', ['==', 'stuetzpunktbahnhof', true]],
  'ch.sbb.barrierfreierbahnhoefe': [
    'all',
    ['==', 'barrierefreier_bahnhof', true],
  ],
  'ch.sbb.nichtbarrierfreierbahnhoefe': [
    'all',
    ['==', 'barrierefreier_bahnhof', false],
  ],
};

const ImmobilienMenuBottom = ({ topic }) => {
  return (
    <div className="wkp-topic-filter">
      <SelectFilter
        label="Kategorie"
        choices={{
          a0: 'Alle',
          a1: 'ch.sbb.stuetzpunktbahnhoefe',
          a2: 'ch.sbb.barrierfreierbahnhoefe',
          a3: 'ch.sbb.nichtbarrierfreierbahnhoefe',
        }}
        defaultValue="a0"
        onChangeCallback={(value) => {
          topic.layers
            .filter((l) => !l.isBaseLayer && l instanceof MapboxStyleLayer)
            .forEach((layer) => {
              if (layer) {
                const { mbMap } = layer.mapboxLayer;
                const style = mbMap.getStyle();
                if (!mbMap || !style) {
                  return;
                }

                for (let i = 0; i < style.layers.length; i += 1) {
                  const styleLayer = style.layers[i];
                  mbMap.setFilter(styleLayer.id, filters[value]);
                }
              }
            });
        }}
      />
    </div>
  );
};

ImmobilienMenuBottom.propTypes = propTypes;

export default ImmobilienMenuBottom;
