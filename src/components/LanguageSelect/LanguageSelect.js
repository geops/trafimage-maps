import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, MenuItem } from '@material-ui/core';
import Select from '../Select';
import { setLanguage } from '../../model/app/actions';
import { ReactComponent as SBBGlobe } from '../../img/sbb/globe_210_large.svg';

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
  },
  icon: {
    width: (props) => (props.isMobileWidth ? 25 : 28),
    height: (props) => (props.isMobileWidth ? 25 : 28),
  },
  expandIcon: {
    width: 18,
  },
  currentValue: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    borderRadius: 2,
    width: (props) => (props.isMobileWidth ? 55 : 120),
    color: '#767676',
    '&:hover': {
      color: theme.palette.secondary.dark,
    },
    '&:hover .MuiOutlinedInput-notchedOutline,& .MuiOutlinedInput-notchedOutline':
      {
        borderWidth: 0,
      },
    '& Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: 1,
    },
  },
  select: {
    padding: '6px 10px !important',
    '& path': {
      stroke: '#767676',
    },
    '&:hover': {
      color: theme.palette.secondary.dark,
    },
    '&:hover path': {
      stroke: theme.palette.secondary.dark,
    },
  },
  menuItem: {
    paddingLeft: 12,
    color: '#767676',
  },
  itemSelected: {
    color: '#000',
    backgroundColor: 'white !important',
  },
}));

const LanguageSelect = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isTabletWidth = useMemo(
    () => ['m'].includes(screenWidth),
    [screenWidth],
  );
  const isMobileWidth = useMemo(
    () => ['xs', 's'].includes(screenWidth),
    [screenWidth],
  );
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
          className={classes.menuItem}
          classes={{ selected: classes.itemSelected }}
        >
          {opt.label}
        </MenuItem>
      );
    });
  }, [options, classes]);

  return (
    <div className={classes.wrapper}>
      <Select
        data-cy="lang-select"
        value={inputValue.value}
        renderValue={(opt) => (
          <span className={classes.currentValue}>
            <SBBGlobe
              focusable={false}
              className={`${classes.icon} wkp-single-value-globe`}
            />
            {!isMobileWidth && options.find((lang) => lang.value === opt).label}
          </span>
        )}
        onChange={onSelectChange}
        className={classes.input}
        classes={{ outlined: classes.select, icon: classes.expandIcon }}
        MenuProps={{
          'data-cy': 'lang-select-options',
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          PaperProps: {
            style: {
              border: `1px solid #888`,
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 0,
              marginTop: isMobileWidth || isTabletWidth ? 28 : 38,
              minWidth: isMobileWidth ? 53 : 118,
              top: '26 !important',
            },
          },
        }}
        variant="outlined"
      >
        {langOptions}
      </Select>
    </div>
  );
};

export default React.memo(LanguageSelect);
