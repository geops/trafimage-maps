import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ReactComponent as Loader } from '../../img/loader.svg';
import PermalinkInput from '../PermalinkInput';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    top: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
}));

function DrawEditLinkInput() {
  const classes = useStyles();
  const { t } = useTranslation();
  const isLoading = useSelector((state) => state.app.isDrawEditLinkLoading);
  const shortenUrl = useSelector((state) => state.app.drawEditLink);

  if (!shortenUrl) {
    return null;
  }

  return (
    <div className={classes.root}>
      <PermalinkInput value={shortenUrl} />
      {isLoading && (
        <Typography variant="subtitle1">
          <span className={classes.loader}>
            <Loader /> <span>{t('Laden...')}</span>
          </span>
        </Typography>
      )}
    </div>
  );
}

export default React.memo(DrawEditLinkInput);
