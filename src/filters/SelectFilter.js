import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormControlLabel,
  Checkbox,
  Chip,
} from '@material-ui/core';
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
  // Callback function on select options.
  onChange: PropTypes.func.isRequired,
  // Possiblity to select multiple values.
  multiple: PropTypes.bool,
  // function returning a promise resolving choices
  fetchChoices: PropTypes.func,
  // whether the control is disabled
  disabled: PropTypes.bool,
  // Add an option to toggle all values
  toggleAllOption: PropTypes.bool,
  // Add an option to show/hide the values after this amount of selected values
  showAllOption: PropTypes.number,
};

const defaultProps = {
  multiple: false,
  toggleAllOption: false,
  showAllOption: 0,
  choices: undefined,
  fetchChoices: undefined,
  disabled: false,
};

const useStyles = makeStyles(() => ({
  formControl: {
    width: '295px',
    marginBottom: '5px',
    fontSize: '14px',
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
    fontSize: '10px',
  },
  rootLabel: {
    color: '#000',
    fontSize: '14px',
  },
  shrink: {
    transform: 'none',
  },
  menuItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  toggleAll: {
    borderBottom: '1px solid black',
  },
  formControlLabel: {
    fontSize: '14px',
  },
  showAllInput: {
    marginBottom: '24px',
  },
  showAll: {
    maxHeight: '750px',
    paddingBottom: '0px',
  },
  showLess: {
    maxHeight: '66px',
  },
  showAllButton: {
    position: 'absolute',
    bottom: '7px',
    left: '5px',
    textTransform: 'none',
    fontSize: '14px',
    color: '#9e9e9e',
    padding: 0,
  },
}));

const SelectFilter = ({
  label,
  choices,
  onChange,
  multiple,
  disabled,
  fetchChoices,
  toggleAllOption,
  showAllOption,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [filters, setFilters] = useState(multiple ? [] : '');
  const [filterChoices, setFilterChoices] = useState(choices || {});
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (fetchChoices) {
      fetchChoices().then((c) => setFilterChoices(c));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchChoices]);

  useEffect(() => {
    if (choices) {
      if (Object.keys(filterChoices).length) {
        const previousChoicesValues = filters.map(
          (f) => filterChoices[f].value,
        );
        const newChoicesValues = Object.entries(choices).map(
          (newChoice) => newChoice[1].value,
        );
        const newFilters = previousChoicesValues
          .filter((p) => newChoicesValues.includes(p))
          .map((filter) => newChoicesValues.indexOf(filter))
          .map((idx) => Object.keys(choices)[idx]);

        setFilters(newFilters);
        setFilterChoices(choices);
      } else {
        setFilterChoices(choices);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choices]);

  const allActivated = useMemo(() => {
    return filters.length === Object.keys(filterChoices).length;
  }, [filters, filterChoices]);
  const allActivatedLabel = allActivated
    ? t('Alle deaktivieren')
    : t('Alle aktivieren');

  const showAllButton = useMemo(() => {
    return showAllOption && filters.length > showAllOption && !allActivated;
  }, [filters, allActivated, showAllOption]);

  const selectAll = () => {
    if (allActivated) {
      setFilters([]);
    } else {
      setFilters(Object.keys(filterChoices));
    }
  };

  if (!Object.entries(filterChoices)) {
    return null;
  }
  return (
    <FormControl className={classes.formControl}>
      <InputLabel
        disabled={disabled}
        classes={{
          root: classes.rootLabel,
          shrink: classes.shrink,
        }}
        id="wkp-select-label"
      >
        {t(label)}
      </InputLabel>
      <Select
        MenuProps={{
          className: classes.menu,
          variant: 'menu',
          getContentAnchorEl: null,
        }}
        inputProps={{
          className: `${showAllButton ? classes.showAllInput : null} ${
            showAll ? classes.showAll : ''
          } ${!showAll && showAllButton ? classes.showLess : ''}`,
        }}
        disabled={disabled}
        labelId="wkp-select-label"
        id="wkp-select"
        value={filters}
        onChange={(e) => {
          let { value } = e.target;

          if (value.length && value.includes('Toggle all')) {
            value = allActivated ? [] : Object.keys(filterChoices);
          }

          if (multiple) {
            const newValues = value.map((v) => filterChoices[v].value);
            setFilters(value);
            onChange(newValues, value);
          } else {
            setFilters(value);
            onChange(filterChoices[value].value, value);
          }
          e.preventDefault();
          e.stopPropagation();
        }}
        multiple={multiple}
        renderValue={(selected) => {
          if (multiple) {
            return (
              <>
                {allActivated ? (
                  'alle'
                ) : (
                  <div className={classes.chips}>
                    {selected.map((value) =>
                      filterChoices[value] ? (
                        <Chip
                          key={value}
                          label={t(filterChoices[value].value)}
                          className={classes.chip}
                          title={t(filterChoices[value].label)}
                        />
                      ) : null,
                    )}
                  </div>
                )}
              </>
            );
          }
          return filterChoices[selected]
            ? t(filterChoices[selected].value)
            : null;
        }}
      >
        {toggleAllOption ? (
          <MenuItem
            value="Toggle all"
            className={`${classes.menuItem} ${classes.toggleAll}`}
            onClick={selectAll}
          >
            {multiple ? (
              <FormControlLabel
                classes={{
                  label: classes.formControlLabel,
                }}
                label={allActivatedLabel}
                control={<RedCheckbox checked={allActivated} />}
              />
            ) : (
              allActivatedLabel
            )}
          </MenuItem>
        ) : null}
        {Object.entries(filterChoices).map((entry) => {
          const [key, item] = entry;
          return (
            <MenuItem key={key} value={key} className={classes.menuItem}>
              {multiple ? (
                <FormControlLabel
                  classes={{
                    label: classes.formControlLabel,
                  }}
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
      {showAllButton ? (
        <div
          role="button"
          tabIndex={0}
          className={classes.showAllButton}
          onClick={() => setShowAll(!showAll)}
          onKeyPress={(e) => e.which === 13 && setShowAll(!showAll)}
        >
          {showAll ? t('weniger anzeigen') : t('weitere anzeigen')}
        </div>
      ) : null}
    </FormControl>
  );
};

SelectFilter.propTypes = propTypes;
SelectFilter.defaultProps = defaultProps;

export default SelectFilter;
