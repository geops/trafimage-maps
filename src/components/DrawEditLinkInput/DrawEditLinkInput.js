import React, { useState, useMemo, useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import qs from 'query-string';
import { ReactComponent as Loader } from '../../img/loader.svg';
import PermalinkInput from '../PermalinkInput';
import { DRAW_PARAM, MAPSET_PARENT_PARAM } from '../../utils/constants';

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
  const [isLoading, setLoading] = useState(true);
  const [shortenUrl, setShortenUrl] = useState('');
  const mapsetUrl = useSelector((state) => state.app.mapsetUrl);
  const drawIds = useSelector((state) => state.app.drawIds);
  const shortenerUrl = useSelector((state) => state.app.shortenerUrl);

  // Get the mapset url
  const url = useMemo(() => {
    const params = qs.parse(window.location.search);
    params[DRAW_PARAM] = drawIds.admin_id;
    return `${mapsetUrl}?${MAPSET_PARENT_PARAM}=${encodeURIComponent(
      `${window.location.href.split('?')[0]}?${qs.stringify(params)}`,
    )}`;
  }, [drawIds, mapsetUrl]);

  // Get the shortened url
  useEffect(() => {
    if (!shortenerUrl) {
      return () => {};
    }
    setLoading(true);
    const abortController = new AbortController();
    fetch(`${shortenerUrl}?url=${url}`, { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setLoading(false);
        setShortenUrl(data.url);
      })
      .catch(() => {
        setLoading(false);
        setShortenUrl(url);
      });
    return () => {
      abortController.abort();
    };
  }, [url, shortenerUrl]);

  if (!drawIds || !drawIds.admin_id) {
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
