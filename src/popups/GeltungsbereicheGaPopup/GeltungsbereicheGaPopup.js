import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Feature from 'ol/Feature';
import { Layer } from 'mobility-toolbox-js/ol';
import {
  makeStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import { AiTwotoneCopyrightCircle } from 'react-icons/ai';
import GeltungsbereicheLegend, { legends } from './GeltungsbereicheLegend';

const propTypes = {
  feature: PropTypes.arrayOf(PropTypes.instanceOf(Feature)).isRequired,
  layer: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,
  renderValidityFooter: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    padding: '10px 0',
  },
  listItem: {
    padding: '0 10px 0',
    maxWidth: 280,
  },
  listItemIcon: {
    minWidth: 20,
    color: theme.palette.text.primary,
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

const GeltungsbereichePopup = ({
  feature: features,
  layer: layers,
  renderValidityFooter,
}) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const layer = layers[0];
  const products = layer.get('products');
  const productsRemark = layer.get('productsRemark');
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
      if (valid === -1) {
        text = 'Gültigkeit vor Ort erfragen';
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
            if (parseInt(keyA, 10) === -1) {
              return 1;
            }
            if (parseInt(keyB, 10) === -1) {
              return -1;
            }
            if (keyA > keyB) {
              return 1;
            }
            if (keyA < keyB) {
              return -1;
            }
            return 0;
          })
          .map(([, feature]) => {
            const valid = feature.get(validPropertyName);
            const text = getTextFromValid(valid);
            return (
              <div key={mot + valid} className={classes.legendItem}>
                <GeltungsbereicheLegend
                  mot={feature.get('mot')}
                  valid={valid}
                  background
                />
                <div>
                  <Typography variant="h4">{t(`gb.mot.${mot}`)}</Typography>
                  <Typography variant="subtitle1">{t(text)}</Typography>
                </div>
              </div>
            );
          });
      })}
      <div className={classes.legendItem}>
        <GeltungsbereicheLegend background />
        <Typography variant="subtitle1">{t('Keine Ermässigung')}</Typography>
      </div>
      {renderValidityFooter && (
        <>
          <br />
          <Typography variant="h4">
            {translations[i18n.language]['Information gilt für diese Produkte']}
            :
          </Typography>
          <List dense>
            {products.map((product) => {
              return (
                <ListItem className={classes.listItem} key={product}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <AiTwotoneCopyrightCircle size={7} />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
                    {
                      // eslint-disable-next-line react/no-danger
                      <span dangerouslySetInnerHTML={{ __html: t(product) }} />
                    }
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
          {productsRemark ? (
            <Typography variant="body1">{t(productsRemark)}</Typography>
          ) : null}
        </>
      )}
    </div>
  );
};

GeltungsbereichePopup.propTypes = propTypes;
GeltungsbereichePopup.defaultProps = {
  renderValidityFooter: true,
};

GeltungsbereichePopup.renderTitle = (feat, layer, t) => {
  return t('ch.sbb.geltungsbereiche');
};

GeltungsbereichePopup.hidePagination = true;
export default GeltungsbereichePopup;
