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
import Chip from '@material-ui/core/Chip';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const RedCheckbox = withStyles({
  root: {
    padding: '5px 6px',
    '&$checked': {
      color: '#eb0000',
    },
  },
  checked: {},
  // eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Checkbox color="default" {...props} />);

const propTypes = {
  // Label of the select Filter.
  label: PropTypes.string.isRequired,
  // values of the select Filter.
  choices: PropTypes.objectOf(
    // PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    PropTypes.oneOfType(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
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
    fontSize: '14px',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    height: 20,
    margin: 2,
    lineHeight: 20,
    fontSize: '0.95em',
  },
  rootLabel: {
    color: '#000',
  },
  shrink: {
    transform: 'translate(0, 1.5px) scale(0.95)',
  },
  menuItem: {
    paddingTop: 0,
    paddingBottom: 0,
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
      <InputLabel
        classes={{
          root: classes.rootLabel,
          shrink: classes.shrink,
        }}
        id="ms-select-label"
      >
        {label}
      </InputLabel>
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
          if (multiple) {
            const newValues = value.map((v) => filterChoices[v].value);
            setFilters(value);
            onChangeCallback(newValues);
          } else {
            setFilters(value);
            onChangeCallback(filterChoices[value].value);
          }
        }}
        multiple={multiple}
        input={<Input />}
        renderValue={(selected) => {
          if (multiple) {
            return (
              <>
                {multiple && (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={t(filterChoices[value].value)}
                        className={classes.chip}
                        title={t(filterChoices[value].label)}
                      />
                    ))}
                  </div>
                )}
              </>
            );
          }
          return filterChoices[selected] ? filterChoices[selected].value : null;
        }}
      >
        {Object.entries(filterChoices).map((entry) => {
          const [key, item] = entry;
          return (
            <MenuItem key={key} value={key} className={classes.menuItem}>
              {multiple ? (
                <FormControlLabel
                  label={t(item.label)}
                  control={
                    <RedCheckbox checked={(filters || []).includes(key)} />
                  }
                />
              ) : (
                t(item.label)
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
