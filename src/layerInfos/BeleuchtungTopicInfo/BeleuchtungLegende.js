import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import LightIcon from '../../img/LightIcon';
import { lightingMapping } from '../BeleuchtungLayerInfo/lightingMapping';

const useStyles = makeStyles(() => {
  return {
    legendWrapper: {
      margin: '10px 0',
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      margin: '5px 0',
    },
    legendRow: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 70,
      '& svg': {
        marginRight: 10,
      },
    },
    subtext: {
      color: '#888',
      fontSize: 12,
    },
  };
});

export const BeleuchtungLegendeRow = ({ lightClass }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.legendRow} key={lightClass}>
      <LightIcon
        color={lightingMapping[lightClass].color}
        label={lightClass}
        fontColor={lightClass.match(/(3|4|2b)/) && 'white'}
        size={35}
      />
      <div>
        <h4 className={classes.title}>
          {`${t('Bahnhofklasse')} ${lightClass}`}
        </h4>
        {t(lightingMapping[lightClass].info[1])} <br />
        <span className={classes.subtext}>{`${
          lightingMapping[lightClass].info[0]
        } ${t('Passagiere/Tag')}`}</span>
      </div>
    </div>
  );
};

BeleuchtungLegendeRow.propTypes = {
  lightClass: PropTypes.string.isRequired,
};

function BeleuchtungLegende() {
  const classes = useStyles();
  return (
    <div className={classes.legendWrapper}>
      {Object.keys(lightingMapping)
        .sort()
        .map((lightClass) => {
          return (
            <BeleuchtungLegendeRow lightClass={lightClass} key={lightClass} />
          );
        })}
    </div>
  );
}

export default BeleuchtungLegende;
