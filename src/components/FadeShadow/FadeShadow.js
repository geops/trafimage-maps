import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => {
  return {
    topShadow: {
      position: 'absolute',
      overflow: 'hidden',
      width: '100%',
      height: 80,
      pointerEvents: 'none',
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        top: -20,
        bottom: 0,
        zIndex: 1,
        height: 20,
        background: '#18191B',
        opacity: 0.2,
        borderRadius: '600px / 50px',
        filter: 'blur(15px)',
      },
    },
  };
});

// Unused component for now (does not work on iOS), but we keep it for now in case it becomes iOS compatible
const FadeShadow = () => {
  const classes = useStyles();
  return <div className={classes.topShadow} />;
};

export default FadeShadow;
