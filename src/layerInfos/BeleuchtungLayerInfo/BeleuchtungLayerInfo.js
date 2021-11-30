import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import LightIcon from '../../img/LightIcon';
import { lightingMapping } from './lightingMapping';

const useStyles = makeStyles(() => {
  return {
    title: {
      display: 'flex',
      alignItems: 'center',
      margin: '5px 0',
    },
    legendRow: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 50,
      '& svg': {
        margin: 10,
      },
    },
    subtext: {
      color: '#888',
      fontSize: 12,
    },
  };
});

function BeleuchtungLayerInfo({ properties }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const lightClass = properties.name.split('beleuchtungsstaerken')[1];
  return (
    <div>
      <div className={classes.legendRow} key={lightClass}>
        <LightIcon
          color={lightingMapping[lightClass].color}
          label={lightClass}
          fontColor={lightClass.match(/(3|4|2b)/) && 'white'}
          size={35}
        />
        <div>
          <h4 className={classes.title}>
            {`${t('Bahnhof Beleuchtungsklasse')} ${lightClass}`}
          </h4>
          {t(lightingMapping[lightClass].info[1])} <br />
          <span className={classes.subtext}>{`${
            lightingMapping[lightClass].info[0]
          } ${t('Passagiere/Tag')}`}</span>
        </div>
      </div>
    </div>
  );
}

BeleuchtungLayerInfo.propTypes = {
  properties: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default BeleuchtungLayerInfo;
