import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, MenuItem } from '@material-ui/core';
import Select from '../Select';
import { setLanguage } from '../../model/app/actions';
import { ReactComponent as SBBGlobe } from '../../img/sbb/globe_210_large.svg';
import useIsMobile from '../../utils/useIsMobile';

const optionsDesktop = [
  { label: 'Deutsch', value: 'de' },
  { label: 'Français', value: 'fr' },
  { label: 'Italiano', value: 'it' },
  { label: 'English', value: 'en' },
];

const optionsMobile = [
  { label: 'DE', value: 'de' },
  { label: 'FR', value: 'fr' },
  { label: 'IT', value: 'it' },
  { label: 'EN', value: 'en' },
];

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: 2,
    width: (props) => (props.isMobileWidth ? 64 : 120),
  },
  icon: {
    color: 'inherit',
    width: (props) => (props.isMobileWidth ? 25 : 28),
    minWidth: (props) => (props.isMobileWidth ? 25 : 28),
    height: (props) => (props.isMobileWidth ? 25 : 28),
    marginLeft: -2, // align with menu item
  },
  currentValue: {
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    color: theme.palette.text.secondary,
    '& svg:not(.MuiSelect-iconOpen) + .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
    '&:hover': {
      color: theme.palette.secondary.dark,
    },
  },
}));

const LanguageSelect = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const isMobileWidth = useIsMobile();
  const classes = useStyles({ isMobileWidth });
  const options = isMobileWidth ? optionsMobile : optionsDesktop;
  const inputValue = useMemo(
    () => options.find((opt) => opt.value === language),
    [language, options],
  );

  const onSelectChange = useCallback(
    (opt) => {
      dispatch(setLanguage(opt.target.value));
    },
    [dispatch],
  );

  const langOptions = useMemo(() => {
    return options.map((opt) => {
      return (
        <MenuItem
          key={opt.value}
          value={opt.value}
          data-cy={`lang-select-option-${opt.value}`}
        >
          {opt.label}
        </MenuItem>
      );
    });
  }, [options]);

  return (
    <div className={classes.wrapper}>
      <Select
        fullWidth
        data-cy="lang-select"
        value={inputValue.value}
        renderValue={(opt) => (
          <span className={classes.currentValue}>
            <SBBGlobe
              focusable={false}
              className={`${classes.icon} wkp-single-value-globe`}
            />
            {!isMobileWidth && (
              <span style={{ paddingTop: 1 }}>
                {options.find((lang) => lang.value === opt).label}
              </span>
            )}
          </span>
        )}
        onChange={onSelectChange}
        className={classes.select}
        MenuProps={{ 'data-cy': 'lang-select-options' }}
      >
        {langOptions}
      </Select>
    </div>
  );
};

export default React.memo(LanguageSelect);
