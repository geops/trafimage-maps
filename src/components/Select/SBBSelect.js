/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { MdExpandMore } from 'react-icons/md';

const useStyles = makeStyles({
  root: {
    backgroundColor: 'whiralte',

    '& svg': {
      height: 24,
    },

    '& .MuiOutlinedInput-notchedOutline': {
      borderWidth: 2,
      borderRadius: 2,
    },

    '&:focus .MuiOutlinedInput-notchedOutline': {
      borderWidth: 0,
    },
  },
  select: {
    paddingTop: 15,
    paddingBottom: 15,
  },
});

const propTypes = {
  props: PropTypes.shape(),
};

const defaultProps = {
  props: {},
};

const SBBSelect = (props) => {
  const classes = useStyles();
  return (
    <Select
      className={classes.root}
      classes={classes}
      variant="outlined"
      IconComponent={MdExpandMore}
      {...props}
    />
  );
};

SBBSelect.propTypes = propTypes;
SBBSelect.defaultProps = defaultProps;
export default SBBSelect;
