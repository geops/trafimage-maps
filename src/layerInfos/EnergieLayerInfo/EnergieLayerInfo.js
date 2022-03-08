import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';

import { EnergiePopupSubtitle } from '../../popups/EnergiePopup/EnergiePopup';

const useStyles = makeStyles({
  leitungen: {
    margin: 0,
    padding: 8,
    fontFamily: ['SBBWeb-Bold', 'Arial', 'sans-serif'],
    '& li': {
      listStyle: 'none',
      marginBottom: '5px',
      '&::before': {
        content: '" "',
        margin: '0 10px 3px 0',
        width: '20px',
        height: '4px',
        display: 'inline-block',
      },
    },
  },
  los1: { '&::before': { backgroundColor: '#12919a' } },
  los2: { '&::before': { backgroundColor: '#da1720' } },
  los3: { '&::before': { backgroundColor: '#71c520' } },
  los4: { '&::before': { backgroundColor: '#f057b3' } },
  los5: { '&::before': { backgroundColor: '#f27211' } },
  los6: { '&::before': { backgroundColor: '#1486da' } },
  los7: { '&::before': { backgroundColor: '#7346bc' } },
  los8: { '&::before': { backgroundColor: '#1abebc' } },
  los9: { '&::before': { backgroundColor: '#f9b914' } },
  los10: { '&::before': { backgroundColor: '#128939' } },
  los11: { '&::before': { backgroundColor: '#a3005b' } },
  ausserhalb: { '&::before': { backgroundColor: 'black' } },
  subtitle: {
    marginLeft: '-30px',
  },
});

const EnergieLayerInfo = ({ properties, t }) => {
  const classes = useStyles();

  if (properties.name === 'ch.sbb.energie.unterwerke') {
    return <EnergiePopupSubtitle kategorie="UW" />;
  }

  if (properties.name === 'ch.sbb.energie.produktionsanlagen') {
    return <EnergiePopupSubtitle kategorie="KW" />;
  }

  return (
    <ul className={classes.leitungen}>
      <li className={classes.subtitle}>{t('ch.sbb.energie.leitungen')}</li>
      <li className={classes.los1}>{t('ch.sbb.energie.los1')}</li>
      <li className={classes.los2}>{t('ch.sbb.energie.los2')}</li>
      <li className={classes.los3}>{t('ch.sbb.energie.los3')}</li>
      <li className={classes.los4}>{t('ch.sbb.energie.los4')}</li>
      <li className={classes.los5}>{t('ch.sbb.energie.los5')}</li>
      <li className={classes.los6}>{t('ch.sbb.energie.los6')}</li>
      <li className={classes.los7}>{t('ch.sbb.energie.los7')}</li>
      <li className={classes.los8}>{t('ch.sbb.energie.los8')}</li>
      <li className={classes.los9}>{t('ch.sbb.energie.los9')}</li>
      <li className={classes.los10}>{t('ch.sbb.energie.los10')}</li>
      <li className={classes.los11}>{t('ch.sbb.energie.los11')}</li>
      <li className={classes.ausserhalb}>{t('ch.sbb.energie.ausserhalb')}</li>
    </ul>
  );
};

EnergieLayerInfo.propTypes = {
  properties: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default EnergieLayerInfo;
