import React from 'react';
import PropTypes from 'prop-types';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import SelectFilter from '../../components/SelectFilter';

const propTypes = {
  topic: PropTypes.shape().isRequired,
};

const filters = {
  region: {
    Alle: undefined,
    ROT: ['==', 'ROT', ['get', 'region']],
    RME: ['==', 'RME', ['get', 'region']],
    RWT: ['==', 'RWT', ['get', 'region']],
  },
};

const ImmobilienMenuBottom = ({ topic }) => {
  const onChangeCallback = (value, type) => {
    topic.layers
      .find((l) => l.key === 'ch.sbb.immobilien-categories')
      .children.filter(
        (l) => !l.isBaseLayer && l.visible && l instanceof MapboxStyleLayer,
      )
      .forEach((layer) => {
        if (layer) {
          const { mbMap } = layer.mapboxLayer;
          const style = mbMap.getStyle();
          if (!mbMap || !style) {
            return;
          }

          const styleLayer = style.layers.find((l) => l.id === layer.key);
          const newStyleLayer = { ...styleLayer };

          if (type === 'leistungstypen' && value) {
            // Remove previous leistungstypen_str filters.
            newStyleLayer.filter = newStyleLayer.filter.filter((fil) => {
              if (
                Array.isArray(fil) &&
                fil[2] &&
                fil[2][1] === 'leistungstypen_str'
              ) {
                return false;
              }
              return true;
            });
            value.forEach((filterValue) => {
              // eslint-disable-next-line no-param-reassign
              newStyleLayer.filter.push([
                'in',
                filterValue,
                ['get', 'leistungstypen_str'],
              ]);
            });
          } else {
            // Removed previous filter values
            Object.values(filters[type]).forEach((f) => {
              if (newStyleLayer.filter.includes(f)) {
                newStyleLayer.filter = newStyleLayer.filter.filter(
                  (fil) => fil !== f,
                );
              }
            });

            if (filters[type] && filters[type][value]) {
              newStyleLayer.filter.push(filters[type][value]);
            }
          }

          // eslint-disable-next-line no-param-reassign
          layer.styleLayers = [newStyleLayer];
          layer.removeStyleLayers();
          layer.addStyleLayers();
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
        onChangeCallback={(e) => onChangeCallback(e, 'region')}
      />
      <SelectFilter
        label="Leistungstypen"
        multiple
        fetchChoices={() => {
          return fetch(
            `https://cartaro2.dev.trafimage.ch/api/v1/immobilien/leistungstypen`,
          )
            .then((res) => res.json())
            .then((res) => {
              const choices = {};
              res.forEach((r, idx) => {
                // eslint-disable-next-line no-param-reassign
                choices[idx] = r.key;
              });
              return choices;
            });
        }}
        onChangeCallback={(e) => onChangeCallback(e, 'leistungstypen')}
      />
    </div>
  );
};

ImmobilienMenuBottom.propTypes = propTypes;

export default ImmobilienMenuBottom;
