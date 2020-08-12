import React from 'react';
import PropTypes from 'prop-types';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import SelectFilter from '../../components/SelectFilter';

const propTypes = {
  topic: PropTypes.shape().isRequired,
};

const filters = {
  Alle: undefined,
  ROT: ['all', ['==', 'region', 'ROT']],
  RME: ['all', ['==', 'region', 'RME']],
  RWT: ['all', ['==', 'region', 'RWT']],
};

const ImmobilienMenuBottom = ({ topic }) => {
  const onChangeCallback = (value) => {
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
  };

  return (
    <div className="wkp-topic-filter">
      <SelectFilter
        label="Region"
        choices={{
          a0: 'Alle',
          a1: 'ROT',
          a2: 'RME',
          a3: 'RWT',
        }}
        defaultValue="a0"
        onChangeCallback={onChangeCallback}
      />
      <SelectFilter
        label="Leistungtypen"
        fetchChoices={() => {
          return fetch(
            `https://cartaro2.dev.trafimage.ch/api/v1/immobilien/leistungstypen`,
          )
            .then((res) => res.json())
            .then((res) => {
              return res;
            });
        }}
        onChangeCallback={onChangeCallback}
      />
    </div>
  );
};

ImmobilienMenuBottom.propTypes = propTypes;

export default ImmobilienMenuBottom;
