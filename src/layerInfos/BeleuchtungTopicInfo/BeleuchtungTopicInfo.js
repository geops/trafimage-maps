import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { lightMapping } from '../../popups/BeleuchtunsPopup/lightMapping';

const useStyles = makeStyles(() => {
  return {
    legendRow: {
      display: 'flex',
      alignItems: 'center',
      margin: '8px 8px 8px 0',
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 60,
    },
    subtext: {
      color: '#888',
      fontSize: 12,
    },
  };
});

const BetriebsRegionenLayerInfo = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div>
      {lightMapping.map((item) => {
        return (
          <div className={classes.legendRow} key={item.key}>
            <div className={classes.iconWrapper}>{item.icon}</div>
            <div>
              {t(item.info[1])} <br />
              <span className={classes.subtext}>{t(item.info[0])}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BetriebsRegionenLayerInfo;
