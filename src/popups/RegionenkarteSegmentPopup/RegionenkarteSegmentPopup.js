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
const TABS = ['region', 'nl', 'av'];

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
    border: '1px solid #dddddd',
    marginTop: -1,
  },
  tabs: {
    '& .MuiTabs-indicator': {
      backgroundColor: 'transparent',
    },
  },
  tab: {
    minWidth: 0,
    marginLeft: 2,
    marginRight: 2,
    marginBottom: -1,
    border: '1px solid #dddddd',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    textTransform: 'none',
    '&:first-child': {
      marginLeft: theme.spacing(2),
    },
    '&:last-child': {
      marginRight: theme.spacing(2),
    },
    '&:hover': {
      color: theme.palette.secondary.dark,
    },
    '&.Mui-selected': {
      borderBottomColor: 'white',
    },
  },
}));

function RegionenkarteSegmentPopup({ layer, feature }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const accessType = layer.get('accessType') || 'public';
  const isPrivate = accessType !== 'private';
  const parsed = qs.parseUrl(window.location.href);
  const [tab, setTab] = useState(parsed.query[PERMALINK_PARAM] || TABS[2]);
  const [avRole, setAvRole] = useState();

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

  useEffect(() => {
    const mbMap = layer?.mapboxLayer?.mbMap;
    if (!mbMap) {
      return () => {};
    }
    const layerId = 'highlightlines';
    if (tab === TABS[0]) {
      mbMap.addLayer({
        id: layerId,
        type: 'line',
        source: 'ch.sbb.anlagenverantwortliche',
        'source-layer': 'ch.sbb.anlagenverantwortliche',
        filter: ['==', 'region', feature.get('region')],
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'region'], 'Ost'],
            '#2F9F48',
            ['==', ['get', 'region'], 'Mitte'],
            '#A083C7',
            ['==', ['get', 'region'], 'West'],
            '#FFCC00',
            ['==', ['get', 'region'], 'Süd'],
            '#DC320A',
            '#00ff00',
          ],
          'line-width': 8,
          'line-opacity': 0.5,
        },
        layout: {
          'line-join': 'round',
        },
      });
    } else if (tab === TABS[1]) {
      const name = feature.get('niederlassung_name');
      mbMap.addLayer({
        id: layerId,
        type: 'line',
        source: 'ch.sbb.anlagenverantwortliche',
        'source-layer': 'ch.sbb.anlagenverantwortliche',
        filter: ['==', 'niederlassung_name', name],
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'region'], 'Ost'],
            '#2F9F48',
            ['==', ['get', 'region'], 'Mitte'],
            '#A083C7',
            ['==', ['get', 'region'], 'West'],
            '#FFCC00',
            ['==', ['get', 'region'], 'Süd'],
            '#DC320A',
            '#00ff00',
          ],
          'line-width': 8,
          'line-opacity': 0.5,
        },
        layout: {
          'line-join': 'round',
        },
      });
    } else if (tab === TABS[2]) {
      const name = feature.get(avRole);
      mbMap.addLayer({
        id: layerId,
        type: 'line',
        source: 'ch.sbb.anlagenverantwortliche',
        'source-layer': 'ch.sbb.anlagenverantwortliche',
        filter: ['==', avRole, name],
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'region'], 'Ost'],
            '#2F9F48',
            ['==', ['get', 'region'], 'Mitte'],
            '#A083C7',
            ['==', ['get', 'region'], 'West'],
            '#FFCC00',
            ['==', ['get', 'region'], 'Süd'],
            '#DC320A',
            '#00ff00',
          ],
          'line-width': 8,
          'line-opacity': 0.5,
        },
        layout: {
          'line-join': 'round',
        },
      });
    }
    return () => {
      if (mbMap.getLayer(layerId)) {
        mbMap.removeLayer('highlightlines');
      }
    };
  }, [feature, isPrivate, layer.mapboxLayer, tab, avRole]);

  return (
    <div className={classes.root}>
      {isPrivate && (
        <>
          <Tabs
            value={TABS.indexOf(tab)}
            onChange={handleChange}
            variant="fullWidth"
            className={classes.tabs}
          >
            <Tab className={classes.tab} label={t('Region')} />
            <Tab className={classes.tab} label={t('NL')} />
            <Tab className={classes.tab} label={t('Av')} />
          </Tabs>
          <div className={classes.tabPanel}>
            {tab === TABS[2] && (
              <Av
                layer={layer}
                feature={feature}
                onChangeRole={(role) => {
                  setAvRole(role);
                }}
              />
            )}
            {tab === TABS[1] && <Nl layer={layer} feature={feature} />}
            {tab === TABS[0] && <Region layer={layer} feature={feature} />}
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
