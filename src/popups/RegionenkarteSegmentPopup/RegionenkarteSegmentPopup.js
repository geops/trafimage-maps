import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Feature from 'ol/Feature';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import { Layer } from 'mobility-toolbox-js/ol';

import Region from './Region';
import Nl from './Nl';
import Av from './Av';

const PERMALINK_PARAM = 'rkTab';
const TABS = ['av', 'nl', 'region'];

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  tabPanel: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
}));

function RegionenkarteSegmentPopup({ layer, feature }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const accessType = layer.get('accessType') || 'public';
  const isPrivate = accessType !== 'private';
  const parsed = qs.parseUrl(window.location.href);
  const [tab, setTab] = useState(parsed.query[PERMALINK_PARAM] || TABS[0]);
  console.log(tab);
  const handleChange = (event, newTab) => {
    setTab(TABS[newTab]);
  };

  useEffect(() => {
    if (isPrivate && tab !== parsed.query[PERMALINK_PARAM]) {
      parsed.query[PERMALINK_PARAM] = tab;
      window.history.replaceState(
        undefined,
        undefined,
        `?${qs.stringify(parsed.query)}`,
      );
    }
  }, [isPrivate, parsed, tab]);

  return (
    <div className={classes.root}>
      {isPrivate && (
        <>
          <Tabs
            value={TABS.indexOf(tab)}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={t('Region')} />
            <Tab label={t('NL')} />
            <Tab label={t('Av')} />
          </Tabs>
          <div className={classes.tabPanel}>
            {!tab && <Region layer={layer} feature={feature} />}
            {tab === TABS[1] && <Nl layer={layer} feature={feature} />}
            {tab === TABS[2] && <Av layer={layer} feature={feature} />}
          </div>
        </>
      )}
      {!isPrivate && <Av layer={layer} feature={feature} />}
    </div>
  );
}

RegionenkarteSegmentPopup.propTypes = {
  layer: PropTypes.instanceOf(Layer).isRequired,
  feature: PropTypes.instanceOf(Feature).isRequired,
};

RegionenkarteSegmentPopup.renderTitle = (feature, t) =>
  t('Detailinformationen');

export default RegionenkarteSegmentPopup;
