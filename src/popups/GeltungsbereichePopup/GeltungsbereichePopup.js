import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Feature from 'ol/Feature';
import { Layer } from 'mobility-toolbox-js/ol';
import { Typography, makeStyles } from '@material-ui/core';
import { geltungsbereicheDataLayer } from '../../config/layers';
// import geltungsbereicheMapping from '../../utils/geltungsbereicheMapping.json';

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

const GeltungsbereichePopup = ({ feature, layer }) => {
  const classes = useStyles();
  const geltungsbereiche = JSON.parse(feature.get('geltungsbereiche'));
  const [geltungsbereicheMapping, setGeltungsbereicheMapping] = useState();
  const apiKey = useSelector((state) => state.app.apiKey);
  const topic = useSelector((state) => state.app.activeTopic);
  const layers = topic.layers.filter((l) => {
    return /^ch.sbb.geltungsbereiche-/.test(l.key);
  });

  useEffect(() => {
    fetch(
      `${geltungsbereicheDataLayer.url}/data/ch.sbb.geltungsbereiche.json?key=${apiKey}`,
    )
      .then((res) => res.json())
      .then((data) => {
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
      {geltungsbereiche &&
        geltungsbereicheMapping &&
        Object.keys(geltungsbereiche).map((product) => {
          return (
            <Typography paragraph key={product}>
              <b>{geltungsbereicheMapping[product]}</b>
              <br />
              <span className={classes.subtext}>
                {geltungsbereiche[product].join(', ')}
              </span>
            </Typography>
          );
        })}
    </div>
  );
};

GeltungsbereichePopup.propTypes = propTypes;
GeltungsbereichePopup.defaultProps = defaultProps;

GeltungsbereichePopup.renderTitle = (feat, t) => {
  const mot = /^(rail|bus)$/.test(feat.get('mot')) ? feat.get('mot') : 'other';
  return `${t('ch.sbb.geltungsbereiche')} - ${t(
    `ch.sbb.geltungsbereiche-${mot}`,
  )}`;
};
export default GeltungsbereichePopup;
