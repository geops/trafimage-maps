import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8em',
    margin: '3px 0',
  },
  shortName: {
    display: 'inline-block',
    flex: '0 0 40px',
    minWidth: '40px',
    marginRight: 5,
  },
});

const propTypes = {
  shortName: PropTypes.string.isRequired,
  longName: PropTypes.string.isRequired,
};

function OperatorShortAndLongName({ shortName, longName }) {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <span className={classes.shortName}>{shortName}</span>
      <span> {t(longName)}</span>
    </div>
  );
}

OperatorShortAndLongName.propTypes = propTypes;

export default React.memo(OperatorShortAndLongName);
