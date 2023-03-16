/* eslint-disable react/prop-types */
import React from 'react';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
// import { useTranslation } from 'react-i18next';
// import Feature from 'ol/Feature';
// import Link from '../../components/Link';
import IpvFeatureInfo from '../../components/IpvFeatureInfo';

const useStyles = makeStyles({
  container: {
    padding: 8,
  },
  header: {
    marginTop: 5,
  },
  row: {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  titleWrapper: {
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 10,
  },
  routeStops: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fromTo: {
    display: 'flex',
    alignItems: 'center',
  },
  route: {
    marginTop: 10,
  },
  routeAbsolute: {
    position: 'absolute',
    margin: 'auto',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  routeIcon: {
    width: 20,
    minWidth: 20,
    height: 35,
    marginRight: 10,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeVertical: {
    width: 4,
    height: '100%',
  },
  routeVerticalFirst: {
    top: '50%',
    height: '50%',
  },
  routeVerticalLast: {
    height: '50%',
    marginTop: 0,
  },
  routeCircleMiddle: {
    height: 6,
    width: 6,
    borderRadius: 6,
    border: '3px solid',
    backgroundColor: '#fff',
    opacity: 1,
    zIndex: 10,
  },
  rowFirst: { fontSize: '1.1em' },
  rowLast: { fontSize: '1.1em' },
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
memoized.renderTitle = () => 'IPV Popup';
memoized.hidePagination = defaultProps;

export default memoized;
