import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  InputLabel,
  MenuItem,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import { MdClear } from 'react-icons/md';
import Select from '../../components/Select';
import geltungsbereicheMapping from '../../utils/geltungsbereicheMapping.json';

const useStyles = makeStyles(() => ({
  selectWrapper: {
    position: 'relative',
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
    top: 14,
    right: (props) => (props.isMobile ? 40 : 30),
  },
}));

const propTypes = {
  topic: PropTypes.shape().isRequired,
};

const GeltungsbereicheMenuFilter = ({ topic }) => {
  const { t, i18n } = useTranslation();
  const nullOption = {
    value: 'gb-null',
    label: 'Alle Produkte',
  };
  const [filterValue, setFilterValue] = useState(nullOption);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const classes = useStyles({ isMobile });

  const providerChoices = useMemo(
    () => [
      nullOption,
      ...Object.keys(geltungsbereicheMapping).map((key) => {
        return {
          value: key,
          label: geltungsbereicheMapping[key],
        };
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language],
  );

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
      }
    });
    setFilterValue(providerChoices.find((opt) => opt.value === value));
  };

  return (
    <div className={`wkp-topic-filter ${classes.selectWrapper}`}>
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
    </div>
  );
};

GeltungsbereicheMenuFilter.propTypes = propTypes;

export default GeltungsbereicheMenuFilter;
