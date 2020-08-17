import React from 'react';
import PropTypes from 'prop-types';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import SelectFilter from '../../components/SelectFilter';

const propTypes = {
  topic: PropTypes.shape().isRequired,
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
          } else if (type === 'region' && newStyleLayer.filter) {
            // Remove previous region filters.
            newStyleLayer.filter = newStyleLayer.filter.filter((fil) => {
              if (Array.isArray(fil) && fil[1] && fil[1][1] === 'region') {
                return false;
              }
              return true;
            });

            if (value.length) {
              // eslint-disable-next-line no-param-reassign
              newStyleLayer.filter.push([
                'match',
                ['get', 'region'],
                value,
                true,
                false,
              ]);
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
        multiple
        choices={{
          a1: {
            label: 'ROT',
            value: 'ROT',
          },
          a2: {
            label: 'RME',
            value: 'RME',
          },
          a3: {
            label: 'RWT',
            value: 'RWT',
          },
        }}
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
                choices[idx] = {
                  value: r.key,
                  label: `${r.key} - ${r.description}`,
                };
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
