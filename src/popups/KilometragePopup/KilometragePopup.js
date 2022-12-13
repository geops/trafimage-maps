import React from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    minWidth: '155px !important',

    '& > div': {
      padding: '3px 0',

      '&:first-child': {
        border: '0 solid  #eee',
        borderBottomWidth: 1,
      },
    },
  },
}));

function KilometragePopup({ feature, t }) {
  const classes = useStyles();
  const { line_number: lineNumber, kilometration } = feature.getProperties();
  return (
    <div className={classes.root}>
      <div>{`${t('DfA Linien Nr.')}: ${lineNumber}`}</div>
      <div>{`${t('Kilometer')}: ${Number(kilometration).toFixed(2)}`}</div>
    </div>
  );
}

KilometragePopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  t: PropTypes.func.isRequired,
};

KilometragePopup.hideHeader = () => true;

export default KilometragePopup;
