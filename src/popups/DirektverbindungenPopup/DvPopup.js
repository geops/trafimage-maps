import React from 'react';
import { makeStyles } from '@material-ui/core';
import DvFeatureInfo from '../../config/ch.sbb.direktverbindungen/DvFeatureInfo';

const useStyles = makeStyles({
  container: {
    padding: '0 !important',
  },
});

const defaultProps = {
  feature: null,
};

const DvPopup = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <DvFeatureInfo />
    </div>
  );
};

DvPopup.defaultProps = defaultProps;

const memoized = React.memo(DvPopup);
memoized.renderTitle = (feat, layer, t) => t(layer.key);
memoized.hidePagination = defaultProps;

export default memoized;
