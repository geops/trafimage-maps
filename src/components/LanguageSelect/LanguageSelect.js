import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../Select';
import { setLanguage } from '../../model/app/actions';
import { ReactComponent as SBBGlobe } from '../../img/sbb/globe_210_large.svg';

import './LanguageSelect.scss';

const options = [
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

const selectStyles = (isMobile) => {
  return {
    container: () => ({
      position: 'relative',
      height: 'calc(100% - 20px)',
      maxHeight: '38px',
      width: isMobile ? '55px' : '120px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      marginRight: isMobile ? '5px' : '0',
      color: 'grey',
    }),
    control: () => ({
      position: 'relative',
      height: '100%',
      width: '100%',
    }),
    valueContainer: () => ({
      position: 'relative',
      height: 'calc(100% - 10px)',
      width: '100%',
      cursor: 'pointer',
    }),
    indicatorsContainer: () => ({
      display: 'none',
    }),
    menu: (provided, state) => ({
      ...provided,
      width: '100%',
      color: state.selectProps.menuColor,
      border: '1px solid #666',
      borderRadius: 'none',
      borderTop: 'none',
      position: 'absolute',
      left: '0',
      margin: '0',
    }),
    option: (styles, state) => ({
      ...styles,
      padding: '10px 15px',
      color: state.isFocused ? '#c60018' : '#767676',
      '&:hover': {
        cursor: state.isSelected ? 'default' : 'pointer',
        color: state.isSelected ? '#767676' : '#c60018',
      },
      backgroundColor: 'white',
    }),
  };
};

const LanguageSelect = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const screenWidth = useSelector((state) => state.app.screenWidth);

  const [inputValue] = useMemo(() => {
    return options.filter((opt) => opt.value === language);
  }, [language]);

  const isMobileWidth = useMemo(() => {
    return ['xs', 's'].includes(screenWidth);
  }, [screenWidth]);

  const onSelectChange = useCallback(
    (opt) => {
      dispatch(setLanguage(opt.value));
    },
    [dispatch],
  );

  return (
    <Select
      options={isMobileWidth ? optionsMobile : options}
      value={inputValue}
      styles={selectStyles(isMobileWidth)}
      selectLabel={
        <SBBGlobe focusable={false} className="wkp-single-value-globe" />
      }
      onChange={onSelectChange}
    />
  );
};

export default React.memo(LanguageSelect);
