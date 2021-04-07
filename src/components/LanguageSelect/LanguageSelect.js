import { memo, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../Select';
import { setLanguage } from '../../model/app/actions';
// import { SBBGlobe } from '../../img/sbb';
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

const getOptionColor = (isFocused, isSelected) => {
  if (isFocused) {
    return '#c60018';
  }
  if (isSelected) {
    return '#000';
  }
  return '#767676';
};

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
      color: getOptionColor(
        isMobile ? false : state.isFocused,
        state.isSelected,
      ),
      '&:hover': {
        cursor: state.isSelected ? 'default' : 'pointer',
        color: getOptionColor(
          isMobile ? false : state.isFocused,
          state.isSelected,
        ),
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

export default memo(LanguageSelect);
