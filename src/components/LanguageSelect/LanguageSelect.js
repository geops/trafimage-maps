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

const selectStyles = {
  container: () => ({
    position: 'relative',
    height: 'calc(100% - 20px)',
    maxHeight: '50px',
    width: '120px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: '20px',
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
    borderBottom: '1px dotted pink',
    color: state.selectProps.menuColor,
    border: '1px solid #666',
    borderRadius: '.14286em',
    borderTop: '.07143em solid #e5e5e5',
    position: 'absolute',
    top: '42px',
  }),
  option: (styles, state) => ({
    ...styles,
    padding: '10px 15px',
    color: 'grey',
    '&:hover': {
      cursor: state.isSelected ? 'default' : 'pointer',
      color: state.isSelected ? 'grey' : 'red',
    },
    backgroundColor: 'white',
  }),
};

const LanguageSelect = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.app.language);
  const [inputValue] = options.filter(opt => opt.value === language);

  return (
    <Select
      options={options}
      isSearchable={false}
      value={inputValue}
      styles={selectStyles}
      components={{ SingleValue }}
      onChange={opt => {
        dispatch(setLanguage(opt.value));
      }}
    />
  );
};

export default LanguageSelect;
