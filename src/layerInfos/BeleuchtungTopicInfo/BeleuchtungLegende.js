import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import LightIcon from '../../img/LightIcon';
import { lightingMapping } from './lightingMapping';

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

function BeleuchtungLegende() {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <h4>{t('Bahnhof-Beleuchtungsklassen')}</h4>
      {Object.keys(lightingMapping)
        .sort()
        .map((lightClass) => {
          const classData = lightingMapping[lightClass];
          return (
            <div className={classes.legendRow} key={lightClass}>
              <div className={classes.iconWrapper}>
                <LightIcon
                  color={classData.color}
                  label={lightClass}
                  fontColor={lightClass.match(/(3|4|2b)/) && 'white'}
                />
              </div>
              <div>
                {t(classData.info[1])} <br />
                <span className={classes.subtext}>{`${classData.info[0]} ${t(
                  'Passagiere/Tag',
                )}`}</span>
              </div>
            </div>
          );
        })}
    </>
  );
}

export default BeleuchtungLegende;
