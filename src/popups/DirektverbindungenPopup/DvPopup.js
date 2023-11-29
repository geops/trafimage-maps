import React from 'react';
import { makeStyles } from '@mui/styles';
import DvFeatureInfo from '../../config/ch.sbb.direktverbindungen/DvFeatureInfo';
import { DvFeatureInfoTitleString } from '../../config/ch.sbb.direktverbindungen/DvFeatureInfoTitle/DvFeatureInfoTitle';

const useStyles = makeStyles({
  container: {
    padding: '0 !important',
  },
});

const defaultProps = {
  feature: null,
};

function DvPopup() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <DvFeatureInfo />
    </div>
  );
}

DvPopup.defaultProps = defaultProps;

const memoized = React.memo(DvPopup);
memoized.renderTitle = () => (
  <span style={{ padding: '2px 0' }}>
    <DvFeatureInfoTitleString />
  </span>
);
memoized.hidePagination = true;

export default memoized;
