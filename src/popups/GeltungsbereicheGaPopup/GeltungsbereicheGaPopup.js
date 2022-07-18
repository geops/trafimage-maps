import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Feature from 'ol/Feature';
import { Layer } from 'mobility-toolbox-js/ol';
import { Typography } from '@material-ui/core';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  layer: PropTypes.instanceOf(Layer).isRequired,
};

const GeltungsbereichePopup = ({ feature, layer }) => {
  const { t } = useTranslation();
  const topic = useSelector((state) => state.app.activeTopic);
  const layers = topic.layers.filter((l) => {
    return /^ch.sbb.geltungsbereiche-/.test(l.key);
  });

  const content = useMemo(() => {
    const reduced = feature.get('mapboxFeature').layer.id.includes('_50');
    return reduced ? (
      <>
        <Typography paragraph>
          <b>
            {t('General-Abo')}, {t('seven25-Abo')} {t('und')}{' '}
            {t('GA-Monatskarte')}
          </b>
          : {t('Fahrt zum ermässigten Preis')}
        </Typography>
        <Typography paragraph>
          <b>{t('Halbtax-Abo')}</b>: {t('Fahrt zum ermässigten Preis')}
        </Typography>
        <Typography paragraph>
          <b>{t('Tageskarte zum Halbtax')}</b>:{' '}
          {t('Fahrt zum ermässigten Preis')}
        </Typography>
        <Typography paragraph>
          <b>
            {t('Tageskarte Gemeinde')}, {t('Spartageskarte')} {t('und')}{' '}
            {t('Aktionstageskarte')} {t('ohne GA/Halbtax-Abo')}
          </b>
          : {t('Fahrt zum ganzen Preis')}
        </Typography>
      </>
    ) : (
      <>
        <Typography paragraph>
          <b>
            {t('General-Abo')}, {t('seven25-Abo')} {t('und')}{' '}
            {t('GA-Monatskarte')}
          </b>
          : {t('Freie Fahrt')}
        </Typography>
        <Typography paragraph>
          <b>{t('Halbtax-Abo')}</b>: {t('Fahrt zum ermässigten Preis')}
        </Typography>
        <Typography paragraph>
          <b>
            {t('Tageskarte zum Halbtax')}, {t('Tageskarte Gemeinde')},{' '}
            {t('Spartageskarte')} {t('und')} {t('Aktionstageskarte')}
          </b>
          : {t('Freie Fahrt')}
        </Typography>
      </>
    );
  }, [t, feature]);

  useEffect(() => {
    // Shift select style to current feature
    layers.forEach((l) => l.select([]));
    if (layer) {
      layer.select([feature]);
    }
  }, [layers, layer, feature]);

  return (
    <div className="wkp-geltungsbereiche-popup">
      {content || t('Keine Geltungsbereiche gefunden')}
    </div>
  );
};

GeltungsbereichePopup.propTypes = propTypes;

GeltungsbereichePopup.renderTitle = (feat, layer, t) => {
  return `${t('ch.sbb.geltungsbereiche')} - ${t(`${layer.name || layer.key}`)}`;
};
export default GeltungsbereichePopup;
