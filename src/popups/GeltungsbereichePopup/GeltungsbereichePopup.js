import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Feature from 'ol/Feature';
import { Layer } from 'mobility-toolbox-js/ol';
import { Typography, makeStyles } from '@material-ui/core';
import { geltungsbereicheDataLayer } from '../../config/layers';

const useStyles = makeStyles(() => {
  return {
    subtext: {
      color: '#888',
    },
  };
});

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(Layer).isRequired,
};

const defaultProps = {};

let geltungsbereicheGlobal;

const GeltungsbereichePopup = ({ feature, layer }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const geltungsbereiche = JSON.parse(feature.get('geltungsbereiche'));
  const [geltungsbereicheMapping, setGeltungsbereicheMapping] = useState();
  const apiKey = useSelector((state) => state.app.apiKey);
  const topic = useSelector((state) => state.app.activeTopic);
  const layers = topic.layers.filter((l) => {
    return /^ch.sbb.geltungsbereiche-/.test(l.key);
  });

  useEffect(() => {
    if (geltungsbereicheGlobal) {
      setGeltungsbereicheMapping(geltungsbereicheGlobal);
      return;
    }
    fetch(
      `${geltungsbereicheDataLayer.url}/data/ch.sbb.geltungsbereiche.json?key=${apiKey}`,
    )
      .then((res) => res.json())
      .then((data) => {
        // We store the products in global variable to avoid fetching it every time
        geltungsbereicheGlobal = data['geops.geltungsbereiche'];
        setGeltungsbereicheMapping(data['geops.geltungsbereiche']);
      })
      .catch((err) =>
        // eslint-disable-next-line no-console
        console.error(
          err,
          new Error('Failed to fetch ch.sbb.geltungsbereiche.json'),
        ),
      );
  }, [apiKey]);

  useEffect(() => {
    // Shift select style to current feature
    layers.forEach((l) => l.select([]));
    if (layer) {
      layer.select([feature]);
    }
  }, [layers, layer, feature]);

  return (
    <div className="wkp-geltungsbereiche-popup">
      {(geltungsbereiche &&
        geltungsbereicheMapping &&
        Object.entries(geltungsbereiche).map((entry) => {
          return (
            <Typography paragraph key={entry[0]}>
              <b>{geltungsbereicheMapping[entry[0]]}</b>
              <br />
              <span className={classes.subtext}>{entry[1].join(', ')}</span>
            </Typography>
          );
        })) ||
        t('Keine Geltungsbereiche gefunden')}
    </div>
  );
};

GeltungsbereichePopup.propTypes = propTypes;
GeltungsbereichePopup.defaultProps = defaultProps;

GeltungsbereichePopup.renderTitle = (feat, layer, t) => {
  return `${t('ch.sbb.geltungsbereiche')} - ${t(`${layer.name || layer.key}`)}`;
};
export default GeltungsbereichePopup;
