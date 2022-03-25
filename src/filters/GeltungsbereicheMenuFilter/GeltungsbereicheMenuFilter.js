import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
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

const GeltungsbereicheMenuFilter = ({ topic }) => {
  const { t } = useTranslation();
  const apiKey = useSelector((state) => state.app.apiKey);
  const [filterValue, setFilterValue] = useState(nullOption);
  const [productChoices, setProductChoices] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetch(
      `${geltungsbereicheDataLayer.url}/data/ch.sbb.geltungsbereiche.json?key=${apiKey}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const choices = [
          nullOption,
          ...Object.entries(data['geops.geltungsbereiche']).map((entry) => {
            return {
              value: entry[0],
              label: entry[1],
            };
          }),
        ];
        setProductChoices(choices);
      })
      .catch((err) =>
        // eslint-disable-next-line no-console
        console.error(
          err,
          new Error('Failed to fetch ch.sbb.geltungsbereiche.json'),
        ),
      );
  }, [apiKey]);

  const layers = topic.layers.filter((l) => {
    return /^ch.sbb.geltungsbereiche-/.test(l.key);
  });

  const onChange = (value) => {
    layers.flat().forEach((layer) => {
      const { mbMap } = layer.mapboxLayer;
      const style = mbMap.getStyle();

      if (!mbMap || !style) {
        return;
      }
      const styleLayer = style.layers.find(layer.styleLayersFilter);
      const newFilter = styleLayer.filter.filter((fil) => {
        // Remove previous product filters.
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
        // Add new filter
        newFilter.push(['in', value, ['get', 'geltungsbereiche_str']]);
      }

      mbMap.setFilter(styleLayer.id, newFilter);
    });

    setFilterValue(productChoices.find((opt) => opt.value === value));
  };

  if (!productChoices.length) {
    return null;
  }

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
          {productChoices.map((opt) => {
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

const propTypes = {
  topic: PropTypes.shape().isRequired,
};

GeltungsbereicheMenuFilter.propTypes = propTypes;

export default GeltungsbereicheMenuFilter;
