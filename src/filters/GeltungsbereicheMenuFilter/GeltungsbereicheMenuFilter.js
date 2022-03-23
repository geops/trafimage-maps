import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  InputLabel,
  MenuItem,
  IconButton,
  FormControl,
  makeStyles,
} from '@material-ui/core';
import { MdClear } from 'react-icons/md';
import Select from '../../components/Select';
import { geltungsbereicheDataLayer } from '../../config/layers';
import geltungsbereicheMapping from '../../utils/geltungsbereicheMapping.json';

const useStyles = makeStyles(() => ({
  selectWrapper: {
    position: 'relative',
  },
  formControl: {
    padding: '20px 0',
  },
  paper: {
    overflow: 'hidden auto',
    maxHeight: 350,
    width: 268,
  },
  item: {
    display: 'block',
    textOverflow: 'ellipsis',
  },
  input: {
    width: 270,
  },
  value: {
    maxWidth: 190,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  clearBtn: {
    position: 'absolute',
    top: 20,
    right: 30,
  },
}));

const nullOption = {
  value: 'gb-null',
  label: 'Alle Produkte',
};

const providerChoices = [
  nullOption,
  ...Object.keys(geltungsbereicheMapping).map((key) => {
    return {
      value: key,
      label: geltungsbereicheMapping[key],
    };
  }),
];

const GeltungsbereicheMenuFilter = () => {
  const { t } = useTranslation();
  const topic = useSelector((state) => state.app.activeTopic);
  const [filterValue, setFilterValue] = useState(nullOption);
  const classes = useStyles();

  const layers = topic.layers.filter((l) => {
    return /^ch.sbb.geltungsbereiche-/.test(l.key);
  });

  const onChange = (value) => {
    const { mbMap } = topic.layers.find((l) => {
      return l.key === geltungsbereicheDataLayer.key;
    });
    const style = mbMap.getStyle();

    // Get the ID of the first layer beneath the gb layers
    const beforeLayerIdx =
      style.layers.reduce((lastIndex, l, idx) =>
        l.metadata && 'geltungsbereiche.filter' in l.metadata ? idx : lastIndex,
      ) + 1;
    const beforeLayerId = style.layers[beforeLayerIdx].id;

    // Add filters to gb layers
    layers.flat().forEach((layer) => {
      if (!mbMap || !style) {
        return;
      }
      const styleLayer = style.layers.find((l) => {
        return layer.styleLayersFilter(l);
      });
      const newStyleLayer = { ...styleLayer };
      // Remove previous product filters.
      newStyleLayer.filter = newStyleLayer.filter.filter((fil) => {
        if (
          Array.isArray(fil) &&
          Array.isArray(fil[2]) &&
          fil[2][1] === 'geltungsbereiche_str'
        ) {
          return false;
        }
        return true;
      });

      if (value && value !== nullOption.value) {
        newStyleLayer.filter.push([
          'in',
          value,
          ['get', 'geltungsbereiche_str'],
        ]);
      }
      // eslint-disable-next-line no-param-reassign
      layer.styleLayers = [newStyleLayer];
      layer.removeStyleLayers();
      layer.addStyleLayers();
    });

    // Move gb layers back under the labels
    style.layers.forEach((l) => {
      return (
        /^geltungsbereiche./.test(l.id) && mbMap.moveLayer(l.id, beforeLayerId)
      );
    });

    setFilterValue(providerChoices.find((opt) => opt.value === value));
  };

  return (
    <div className={`wkp-topic-filter ${classes.selectWrapper}`}>
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="gb-product-filter">
          {t('Produkt')}
        </InputLabel>
        <Select
          inputProps={{
            name: 'gb-product-filter',
            id: 'gb-product-filter',
          }}
          onChange={(evt) => onChange(evt.target.value)}
          value={filterValue.value}
          MenuProps={{ classes: { paper: classes.paper } }}
          className={classes.input}
          renderValue={() => (
            <div className={classes.value}>{t(filterValue.label)}</div>
          )}
        >
          {providerChoices.map((opt) => {
            return (
              <MenuItem
                key={opt.value}
                value={opt.value}
                classes={{ root: classes.item }}
                title={opt.label}
              >
                {opt.label}
              </MenuItem>
            );
          })}
        </Select>
        {filterValue.value !== nullOption.value && (
          <IconButton
            onClick={() => onChange(nullOption.value)}
            className={classes.clearBtn}
          >
            <MdClear />
          </IconButton>
        )}
      </FormControl>
    </div>
  );
};

export default GeltungsbereicheMenuFilter;
