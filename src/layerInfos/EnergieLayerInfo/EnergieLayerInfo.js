import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import { energieleitungenColorMapping } from '../../utils/constants';

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
  los1: { '&::before': { backgroundColor: energieleitungenColorMapping.los1 } },
  los2: { '&::before': { backgroundColor: energieleitungenColorMapping.los2 } },
  los3: { '&::before': { backgroundColor: energieleitungenColorMapping.los3 } },
  los4: { '&::before': { backgroundColor: energieleitungenColorMapping.los4 } },
  los5: { '&::before': { backgroundColor: energieleitungenColorMapping.los5 } },
  los6: { '&::before': { backgroundColor: energieleitungenColorMapping.los6 } },
  los7: { '&::before': { backgroundColor: energieleitungenColorMapping.los7 } },
  los8: { '&::before': { backgroundColor: energieleitungenColorMapping.los8 } },
  los9: { '&::before': { backgroundColor: energieleitungenColorMapping.los9 } },
  los10: {
    '&::before': { backgroundColor: energieleitungenColorMapping.los10 },
  },
  los11: {
    '&::before': { backgroundColor: energieleitungenColorMapping.los11 },
  },
  ausserhalb: {
    '&::before': { backgroundColor: energieleitungenColorMapping.ausserhalb },
  },
  subtitle: {
    marginLeft: '-30px',
  },
});

const EnergieLayerInfo = ({ properties, t }) => {
  const classes = useStyles();

  if (properties.name.match(/ch.sbb.energie(.public)?.unterwerke/)) {
    return <EnergiePopupSubtitle kategorie="UW" />;
  }

  if (properties.name.match(/ch.sbb.energie(.public)?.produktionsanlagen/)) {
    return <EnergiePopupSubtitle kategorie="KW" />;
  }

  return (
    <ul className={classes.leitungen}>
      <li className={classes.subtitle}>{t('ch.sbb.energie.leitungen')}</li>
      {Object.keys(energieleitungenColorMapping).map((los) => (
        <li key={los} className={classes[los]}>
          {t(`ch.sbb.energie.${los}`)}
        </li>
      ))}
    </ul>
  );
};

EnergieLayerInfo.propTypes = {
  properties: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default EnergieLayerInfo;
