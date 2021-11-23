import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import LightIcon from './LightIcon';

const lightMapping = [
  {
    color: '#eace28',
    info: ['1', '>= 20000', 'Hohes Personenaufkommen'],
  },
  {
    color: '#eaaf0a',
    info: ['2a', '10000 - 19999', 'Mittleres Personenaufkommen'],
  },
  {
    color: '#cc8912',
    info: ['2b', '1500 - 9999', 'Mittleres Personenaufkommen'],
  },
  {
    color: '#996717',
    info: ['3', '50 - 1499', 'Geringes Personenaufkommen'],
  },
  {
    color: '#684614',
    info: ['4', '< 50', 'Sehr geringes Personenaufkommen'],
  },
];

const useStyles = makeStyles(() => {
  return {
    legendRow: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 50,
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
          <div className={classes.legendRow} key={item.info[0]}>
            <div className={classes.iconWrapper}>
              <LightIcon
                color={item.color}
                label={item.info[0]}
                fontColor={item.info[0].match(/(3|4|2b)/) && 'white'}
              />
            </div>
            <div>
              {t(item.info[2])} <br />
              <span className={classes.subtext}>{`${item.info[1]} ${t(
                'Passagiere/Tag',
              )}`}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BetriebsRegionenLayerInfo;
