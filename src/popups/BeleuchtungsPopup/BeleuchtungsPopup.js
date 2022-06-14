import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import LightIcon from '../../img/LightIcon';
import PersonCard from '../../components/PersonCard';
import question from '../../img/circleQuestionMark.svg';
import { lightingMapping } from '../../layerInfos/BeleuchtungLayerInfo/lightingMapping';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

const useStyles = makeStyles(() => {
  return {
    line: {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginLeft: 10,
      },
    },
  };
});

const BeleuchtungsPopup = ({ feature }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const stationClass = feature.get('rte_klasse');
  const { color } = lightingMapping[stationClass];

  return (
    <div>
      <p className={classes.line}>
        {t('Bahnhofklasse')}
        <LightIcon
          color={color}
          label={stationClass}
          fontColor={stationClass.match(/(3|4|2b)/) && 'white'}
          size={25}
        />
      </p>
      <div>
        <PersonCard
          title={<b>FOOO</b>}
          name="Foo Wank"
          email="foo@wank.co.uk"
        />
        <PersonCard
          title="Wank"
          name="Wanky Wank"
          email="wank@wank.co.uk"
          phone="0471 1234567"
          otherDetails={[
            { id: 'test', icon: question, label: 'extrawank' },
            { id: 'test2', icon: question, label: 'extrawank' },
            { id: 'test1', icon: question, label: 'extrawank' },
          ]}
        />
      </div>
    </div>
  );
};

BeleuchtungsPopup.propTypes = propTypes;
const memoized = memo(BeleuchtungsPopup);
memoized.renderTitle = (feat) => feat.get('name');
export default memoized;
