import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Line from './Line';
import Person from './Person';

const useStyles = makeStyles((theme) => ({
  description: {
    flex: '0 0',
    '& > div:first-child': {
      paddingBottom: theme.spacing(2),
    },
  },
}));

function Nl({ feature }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    niederlassung_name: name,
    niederlassung_leiter: leiter,
  } = feature.getProperties();
  const person = leiter && JSON.parse(leiter);
  return (
    <>
      <Line feature={feature} />
      <div className={classes.description}>
        <div>{`${t('Leiter NL')} ${name}`}</div>
        {person && <Person person={person} isIntern />}
      </div>
    </>
  );
}

Nl.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

export default Nl;
