import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    partner: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '8px 0',
      overflowX: 'hidden',
    },
    label: {
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
    },
    partnerColor: {
      flexShrink: 0,
      width: (props) => props.iconSize || 15,
      height: (props) => props.iconSize || 15,
      border: `1px solid ${theme.colors.lightgray}`,
    },
  };
});

function TarifverbundPartner({ color, label, iconSize, style }) {
  const classes = useStyles({ iconSize });
  return (
    <div className={classes.partner}>
      <div
        className={classes.partnerColor}
        style={
          style || {
            backgroundColor: color || 'black',
          }
        }
      />
      <span className={classes.label}>{label}</span>
    </div>
  );
}

TarifverbundPartner.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  style: PropTypes.shape(),
  iconSize: PropTypes.number,
};

TarifverbundPartner.defaultProps = {
  style: null,
  iconSize: 15,
};

export default TarifverbundPartner;
