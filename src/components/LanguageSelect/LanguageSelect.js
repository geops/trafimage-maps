import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { setLanguage } from '../../model/app/actions';

import SingleValue from './SingleValue';

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

const selectStyles = (screenWidth, isMobile) => {
  return {
    container: () => ({
      position: 'relative',
      height: 'calc(100% - 20px)',
      maxHeight: '50px',
      width: isMobile ? '55px' : '120px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      marginRight: isMobile ? '5px' : '20px',
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
      top: ['xs', 's', 'm'].includes(screenWidth) ? '29px' : '42px',
    }),
    option: (styles, state) => ({
      ...styles,
      padding: '10px 15px',
      color: 'grey',
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
  const language = useSelector(state => state.app.language);
  const screenWidth = useSelector(state => state.app.screenWidth);
  const [inputValue] = options.filter(opt => opt.value === language);
  const isMobileWidth = ['xs', 's'].includes(screenWidth);

  return (
    <Select
      options={isMobileWidth ? optionsMobile : options}
      isSearchable={false}
      value={inputValue}
      styles={selectStyles(screenWidth, isMobileWidth)}
      components={{ SingleValue }}
      onChange={opt => {
        dispatch(setLanguage(opt.value));
      }}
    />
  );
};

export default LanguageSelect;
