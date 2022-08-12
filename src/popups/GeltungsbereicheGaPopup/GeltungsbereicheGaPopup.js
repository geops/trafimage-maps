import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Feature from 'ol/Feature';
import { Layer } from 'mobility-toolbox-js/ol';
import { makeStyles, Typography } from '@material-ui/core';
import GeltungsbereicheLegend, { legends } from './GeltungsbereicheLegend';

const propTypes = {
  feature: PropTypes.arrayOf(PropTypes.instanceOf(Feature)).isRequired,
  layer: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,
};

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 300,
  },
  abos: {
    '&::first-letter': {
      textTransform: 'uppercase',
    },
  },
}));

const translations = {
  de: {
    'Information gilt für diese Produkte':
      'Information gilt für diese Produkte',
  },
  en: {
    'Information gilt für diese Produkte':
      'Information applies to these products',
  },
  fr: {
    'Information gilt für diese Produkte':
      "L'information s'applique à ces produits",
  },
  it: {
    'Information gilt für diese Produkte':
      'Informazioni applicabili a questi prodotti',
  },
};

const GeltungsbereichePopup = ({ feature: features, layer: layers }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const layer = layers[0];
  const validPropertyName = layer.get('validPropertyName');
  const getTextFromValid =
    layer.get('getTextFromValid') ||
    ((valid) => {
      let text = 'Keine Ermässigung';
      if (valid === 50 || valid === 25) {
        text = 'Fahrt zum ermässigten Preis';
      }
      if (valid === 100) {
        text = 'Freie Fahrt';
      }
      return text;
    });

  // Keep same mot order as in the legends
  const featuresByMot = {};
  legends.forEach((legend) => {
    if (legend.mots.length) {
      featuresByMot[legend.mots[0]] = {};
    }
  });

  features.forEach((feat) => {
    let mot = feat.get('mot');
    if (mot === 'tram') {
      mot = 'rail';
    }
    if (mot === 'funicular') {
      mot = 'gondola';
    }
    if (!featuresByMot[mot]) {
      featuresByMot[mot] = {};
    }

    if (!featuresByMot[mot][feat.get(validPropertyName)]) {
      featuresByMot[mot][feat.get(validPropertyName)] = feat;
    }
  });

  return (
    <div className={classes.root}>
      {Object.entries(featuresByMot).map(([mot, validGa]) => {
        return Object.entries(validGa)
          .sort(([keyA], [keyB]) => {
            if (keyA < keyB) {
              return -1;
            }
            if (keyA > keyB) {
              return 1;
            }
            return 0;
          })
          .map(([, feature]) => {
            const valid = feature.get(validPropertyName);
            const text = getTextFromValid(valid);
            return (
              <div key={mot + valid}>
                <GeltungsbereicheLegend
                  mot={feature.get('mot')}
                  valid={valid}
                />
                <div>
                  <Typography variant="h4" style={{ display: 'inline-block' }}>
                    {t(`gb.mot.${mot}`)}
                  </Typography>
                  : {t(text)}
                </div>
                <br />
              </div>
            );
          });
      })}

      <div>
        <GeltungsbereicheLegend />
        <div>{t('Keine Ermässigung')}</div>
        <br />
      </div>
      <br />
      <Typography variant="h4">
        {translations[i18n.language]['Information gilt für diese Produkte']}:
      </Typography>
      {t(layer.name)
        .split(', ')
        .map((text) => {
          return (
            <Typography key={text} className={classes.abos}>
              {t(text)}
            </Typography>
          );
        })}
    </div>
  );
};

GeltungsbereichePopup.propTypes = propTypes;

GeltungsbereichePopup.renderTitle = (feat, layer, t) => {
  return t('ch.sbb.geltungsbereiche');
};

GeltungsbereichePopup.hidePagination = true;
export default GeltungsbereichePopup;
