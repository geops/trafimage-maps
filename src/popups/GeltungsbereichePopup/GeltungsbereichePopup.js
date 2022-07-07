import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Feature from 'ol/Feature';
import { Layer } from 'mobility-toolbox-js/ol';
import { Typography } from '@material-ui/core';

// const useStyles = makeStyles(() => {
//   return {
//     subtext: {
//       color: '#888',
//     },
//   };
// });

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(Layer).isRequired,
};

const defaultProps = {};

const desc = {
  de: (
    <>
      <Typography paragraph>
        <b>General-Abo, seven25-Abo und GA-Monatskarte</b>: Freie Fahrt
      </Typography>
      <Typography paragraph>
        <b>Halbtax-Abo</b>: Fahrt zum ermässigten Preis
      </Typography>
      <Typography paragraph>
        <b>
          Tageskarte zum Halbtax, Tageskarte Gemeinde, Spartageskarte und
          Aktionstageskarte
        </b>
        : Freie Fahrt
      </Typography>
    </>
  ),
  fr: (
    <>
      <Typography paragraph>
        <b>Abonnement général/seven25 et carte mensuelle AG</b>: Libre
        circulation
      </Typography>
      <Typography paragraph>
        <b>Abonnement demi-tarif</b>: Voyages à prix réduit
      </Typography>
      <Typography paragraph>
        <b>
          Carte journalière pour le demi-tarif, carte journalière Commune, carte
          journalière dégriffée et carte journalière promo
        </b>
        : Libre circulation
      </Typography>
    </>
  ),
  it: (
    <>
      <Typography paragraph>
        <b>Abbonamento generale, seven25 e carta mensile AG</b>: Libera
        circolazione
      </Typography>
      <Typography paragraph>
        <b>Abbonamento metà-prezzo</b>: Viaggi a prezzo ridotto
      </Typography>
      <Typography paragraph>
        <b>
          Carta giornaliera per il metà-prezzo, carta giornaliera Comune, carta
          giornaliera risparmio e carta giornaliera promo
        </b>
        : Libera circolazione
      </Typography>
    </>
  ),
  en: (
    <>
      <Typography paragraph>
        <b>GA, seven25 Travelcard and 1-month GA Travelcard</b>: Free travel
      </Typography>
      <Typography paragraph>
        <b>Half Fare Card</b>: Reduced price
      </Typography>
      <Typography paragraph>
        <b>
          One-day travelpass for the Half Fare Card, municipal one-day
          travelpass, Saver Day Pass and special Day Pass
        </b>
        : Free travel
      </Typography>
    </>
  ),
};

const GeltungsbereichePopup = ({ feature, layer }) => {
  const { t, i18n } = useTranslation();
  // const classes = useStyles();
  // const geltungsbereiche = JSON.parse(feature.get('geltungsbereiche'));
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
      {desc[i18n.language] || t('Keine Geltungsbereiche gefunden')}
    </div>
  );
};

GeltungsbereichePopup.propTypes = propTypes;
GeltungsbereichePopup.defaultProps = defaultProps;

GeltungsbereichePopup.renderTitle = (feat, layer, t) => {
  return `${t('ch.sbb.geltungsbereiche')} - ${t(`${layer.name || layer.key}`)}`;
};
export default GeltungsbereichePopup;
