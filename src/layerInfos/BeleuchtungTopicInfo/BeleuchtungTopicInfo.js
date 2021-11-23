import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import LightIcon from './LightIcon';

const lightMapping = [
  {
    key: '1',
    info: ['>= 20000', 'Hohes Personenaufkommen'],
    icon: <LightIcon color="#eace28" label="1" />,
  },
  {
    key: '2a',
    info: ['10000 - 19999', 'Mittleres Personenaufkommen'],
    icon: <LightIcon color="#eaaf0a" label="2a" />,
  },
  {
    key: '2b',
    info: ['1500 - 9999', 'Mittleres Personenaufkommen'],
    icon: <LightIcon color="#cc8912" label="2b" />,
  },
  {
    key: '3',
    info: ['50 - 1499', 'Geringes Personenaufkommen'],
    icon: <LightIcon color="#996717" label="3" fontColor="white" />,
  },
  {
    key: '4',
    info: ['< 50', 'Sehr geringes Personenaufkommen'],
    icon: <LightIcon color="#684614" label="4" fontColor="white" />,
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
          <div className={classes.legendRow} key={item.key}>
            <div className={classes.iconWrapper}>{item.icon}</div>
            <div>
              {t(item.info[1])} <br />
              <span className={classes.subtext}>{`${item.info[0]} ${t(
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
