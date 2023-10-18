import React from 'react';
import PropTypes from 'prop-types';
import { Feature } from 'ol';
import { Typography, makeStyles } from '@material-ui/core';
import RailplusLayer from '../../layers/RailplusLayer';

const useStyles = makeStyles((theme) => ({
  railplusPopup: {
    maxWidth: 200,
  },
  dividerRoot: {
    height: 2,
    margin: '10px 0',
    backgroundColor: theme.colors.gray,
  },
  providerName: {
    fontSize: 16,
    // color: theme.colors.gray,
  },
  link: {
    '&:link': {
      textDecoration: 'none !important',
    },
  },
}));

function RailplusPopup({ feature, layer }) {
  const classes = useStyles();
  const isbNummer = feature.get('isb_tu_nummer');
  const tuDetails = layer.railplusProviders.find((tu) => !!tu[isbNummer])[
    isbNummer
  ];

  return (
    <div className={classes.railplusPopup}>
      {/* <a
        href={provider.url}
        target="_blank"
        rel="noopener noreferrer"
        className={classes.link}
      >
        <img src={provider.logo} style={{ width: '100%' }} alt="logo" />
        <Divider classes={{ root: classes.dividerRoot }} />
        <Typography className={classes.providerName}>
          {provider.name}
        </Typography>
      </a> */}
      <Typography className={classes.providerName}>
        {tuDetails.long_name}
      </Typography>
    </div>
  );
}

RailplusPopup.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(RailplusLayer).isRequired,
};

export default RailplusPopup;
