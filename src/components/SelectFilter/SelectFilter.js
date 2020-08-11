import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

const propTypes = {
  // Label of the select Filter.
  label: PropTypes.string.isRequired,
  // values of the select Filter.
  choices: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  // Default value for none multiple select.
  defaultValue: PropTypes.string,
  // Callback function on select options.
  onChangeCallback: PropTypes.func.isRequired,
  // Possiblity to select multiple values.
  multiple: PropTypes.bool,
  // function returning a promise resolving choices
  fetchChoices: PropTypes.func,
};

const defaultProps = {
  defaultValue: '',
  multiple: false,
  choices: undefined,
  fetchChoices: undefined,
};

const useStyles = makeStyles(() => ({
  formControl: {
    width: '100%',
  },
  menu: {
    maxHeight: 350,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    height: 20,
    margin: 2,
    lineHeight: 20,
  },
}));

const SelectFilter = ({
  label,
  choices,
  onChangeCallback,
  multiple,
  fetchChoices,
  defaultValue,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [filters, setFilters] = useState(multiple ? [] : defaultValue);
  const [filterChoices, setFilterChoices] = useState(choices || []);

  useEffect(() => {
    if (fetchChoices) {
      fetchChoices().then((c) => setFilterChoices(c));
    }
  }, [fetchChoices]);

  const defaultVal = multiple ? [] : defaultValue;

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="ms-select-label">{label}</InputLabel>
      <Select
        MenuProps={{
          className: classes.menu,
          variant: 'menu',
          getContentAnchorEl: null,
        }}
        labelId="wkp-select-label"
        id="wkp-select"
        value={filters && filters.length ? filters : defaultVal}
        onChange={(e) => {
          const { value } = e.target;
          setFilters(value);
          onChangeCallback(filterChoices[value]);
        }}
        multiple={multiple}
        input={<Input />}
      >
        {Object.entries(filterChoices).map((entry) => {
          const [key, value] = entry;
          return (
            <MenuItem key={key} value={key}>
              {multiple ? (
                <FormControlLabel
                  label={t(value)}
                  control={<Checkbox checked={(filters || []).includes(key)} />}
                />
              ) : (
                t(value)
              )}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

SelectFilter.propTypes = propTypes;
SelectFilter.defaultProps = defaultProps;

export default SelectFilter;
