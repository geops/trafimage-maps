import React from 'react';
import { Divider, Typography, makeStyles } from '@material-ui/core';
import providers from '../../config/ch.railplus.meterspurbahnen/providersMapping';

const useStyles = makeStyles((theme) => ({
  dividerRoot: {
    height: 2,
    margin: '10px 0',
    backgroundColor: theme.colors.gray,
  },
  providerName: {
    fontSize: 16,
    color: theme.colors.gray,
  },
  link: {
    '&:link': {
      textDecoration: 'none !important',
    },
  },
}));

function RailplusMeterspurPopup() {
  const classes = useStyles();
  const provider = providers[Math.floor(Math.random() * 5)]; // TODO: get info from tiles once style is ready
  return (
    <div className={classes.railplusPopup}>
      <a
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
      </a>
    </div>
  );
}

RailplusMeterspurPopup.hideHeader = () => true;

export default RailplusMeterspurPopup;
