import React from 'react';
import { makeStyles } from '@material-ui/core';
import IpvFeatureInfo from '../../components/IpvFeatureInfo';

const useStyles = makeStyles({
  container: {
    padding: '0 !important',
  },
});

const defaultProps = {
  feature: null,
};

const IpvPopup = () => {
  // const { t, i18n } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <IpvFeatureInfo />
    </div>
  );
};

IpvPopup.defaultProps = defaultProps;

const memoized = React.memo(IpvPopup);
memoized.renderTitle = (feat, layer, t) => t(layer.key);
memoized.hidePagination = defaultProps;

export default memoized;
