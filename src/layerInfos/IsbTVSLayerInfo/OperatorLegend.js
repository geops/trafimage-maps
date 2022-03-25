import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  legendItem: {
    margin: '0 0 5 0',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  legendSymbol: {
    width: 45,
    minWidth: 45,
    height: 18,
    margin: 5,
    marginLeft: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 35px',
  },
  legendText: {
    position: 'absolute',
    color: 'white',
    fontWeight: 'bold',
    padding: '0 3px',
    fontSize: 13,
    width: 26,
    height: 15,
  },
  legendLine: {
    position: 'absolute',
    width: 4,
    height: 44, // not 45, otherwise it looks blurry
    transform: 'rotate(90deg)',
  },
});

const propTypes = {
  shortName: PropTypes.string.isRequired,
  longName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const OperatorLegend = ({ shortName, longName, color }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.legendItem} key={shortName}>
      <div className={classes.legendSymbol}>
        <div
          className={classes.legendLine}
          style={{ backgroundColor: color }}
        />
        <div className={classes.legendText} style={{ backgroundColor: color }}>
          <span>{shortName.substring(0, 3)}</span>
        </div>
      </div>
      <div>{t(longName)}</div>
    </div>
  );
};

OperatorLegend.propTypes = propTypes;

export default React.memo(OperatorLegend);
