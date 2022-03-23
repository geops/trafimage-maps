import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Feature from 'ol/Feature';
import { Layer } from 'mobility-toolbox-js/ol';
import { Typography, makeStyles } from '@material-ui/core';
import geltungsbereicheMapping from '../../utils/geltungsbereicheMapping.json';

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
  const topic = useSelector((state) => state.app.activeTopic);
  const layers = topic.layers.filter((l) => {
    return /^ch.sbb.geltungsbereiche-/.test(l.key);
  });

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

GeltungsbereichePopup.renderTitle = (f, t) => {
  return t('ch.sbb.geltungsbereiche');
};
export default GeltungsbereichePopup;
