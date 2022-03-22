import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SelectFilter from '../../components/SelectFilter';
import geltungsbereicheMapping from '../../utils/geltungsbereicheMapping.json';

const providerChoices = Object.keys(geltungsbereicheMapping).map((key) => {
  return {
    value: key,
    label: geltungsbereicheMapping[key],
  };
});

const propTypes = {
  topic: PropTypes.shape().isRequired,
};

const GeltungsbereicheMenuFilter = ({ topic }) => {
  const { t } = useTranslation();

  const layers = topic.layers.filter((l) => {
    return /^ch.sbb.geltungsbereiche-/.test(l.key);
  });

  const onChange = (value) => {
    layers.flat().forEach((layer) => {
      if (layer) {
        const { mbMap } = layer.mapboxLayer;
        const style = mbMap.getStyle();
        if (!mbMap || !style) {
          return;
        }
        const styleLayer = style.layers.find((l) => {
          const regex = new RegExp(
            `^geltungsbereiche.${layer.key.split('-')[1]}$`,
            'gi',
          );
          return regex.test(l.id);
        });
        const newStyleLayer = { ...styleLayer };

        if (value) {
          // Remove previous product filters.
          newStyleLayer.filter = newStyleLayer.filter.filter((fil) => {
            if (
              Array.isArray(fil) &&
              Array.isArray(fil[1]) &&
              fil[1][2] &&
              fil[1][2][1] === 'geltungsbereiche_str'
            ) {
              return false;
            }
            return true;
          });
          const productFilters = value.map((filterValue) => {
            return ['in', filterValue, ['get', 'geltungsbereiche_str']];
          });
          if (productFilters.length) {
            newStyleLayer.filter.push(['any', ...productFilters]);
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
        label={t('Produkte')}
        multiple
        toggleAllOption
        showAllOption={9}
        choices={providerChoices}
        onChange={onChange}
        renderChip={(val) =>
          providerChoices.find((product) => product.value === val)?.label
        }
      />
    </div>
  );
};

GeltungsbereicheMenuFilter.propTypes = propTypes;

export default GeltungsbereicheMenuFilter;
