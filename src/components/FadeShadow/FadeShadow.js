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
      '&::before': {
        content: '""',
        position: 'absolute',
        zIndex: 1,
        transform: 'translateY(-330px)',
        left: 0,
        backgroundImage:
          'radial-gradient(circle, rgba(220,220,220, 1), rgba(220,220,220,0) 75%)',
        width: '100%',
        height: '30em',
      },
    },
  };
});

const FadeShadow = () => {
  const classes = useStyles();
  return <div className={classes.topShadow} />;
};

export default FadeShadow;
