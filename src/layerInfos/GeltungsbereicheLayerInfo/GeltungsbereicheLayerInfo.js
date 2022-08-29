import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';
import { Layer } from 'mobility-toolbox-js/ol';
import GeltungsbereicheLegend, {
  legends,
} from '../../popups/GeltungsbereicheGaPopup/GeltungsbereicheLegend';

const useStyles = makeStyles(() => ({
  firstLetter: {
    '&::first-letter': {
      textTransform: 'uppercase',
    },
  },
}));

const infos = {
  ga: {
    100: 'Freie Fahrt',
    50: 'Fahrt zum ermässigten Preis',
  },
  tk: {
    100: 'Freie Fahrt',
  },
  hta: {
    100: 'Fahrt zum ermässigten Preis',
  },
  sts: {
    100: 'Freie Fahrt',
    50: '50% oder 25% Ermässigung',
  },
};

const GeltungsbereicheLayerInfo = ({ properties: layer }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const cardsScope = layer.get('cardsScope') || 'ga';
  const cardsInfos = infos[cardsScope];
  const full = infos[cardsScope]['100'];
  const reduced = infos[cardsScope]['50'];
  return (
    <div style={{ maxHeight: 450 }}>
      {/* <Typography paragraph>{comps[i18n.language]}</Typography> */}

      {legends.map(({ mots: [mot], validity }) => {
        if (mot === null) {
          return null;
        }
        return (
          <table key={mot + validity} style={{ marginBottom: 10 }}>
            <thead />
            <tbody>
              {validity.map(({ value }, index) => {
                if (!cardsInfos[`${value}`]) {
                  return null;
                }
                return (
                  <tr key={mot + value}>
                    <td>
                      <GeltungsbereicheLegend mot={mot} valid={value} />
                    </td>
                    {index === 0 && (
                      <td rowSpan={validity.length}>{t(`gb.mot.${mot}`)}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      })}
      <br />
      <br />
      <table style={{ marginBottom: 10 }}>
        <thead />
        <tbody>
          <tr>
            {legends.map(({ mots: [mot] }) => {
              if (mot === null) {
                return null;
              }
              return (
                <td key={mot}>
                  <GeltungsbereicheLegend mot={mot} valid={100} />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      {full && (
        <>
          <Typography paragraph className={classes.firstLetter}>
            <b>{t(layer.name)}</b>: {t(full)}
          </Typography>
        </>
      )}
      <br />
      <br />

      {reduced && (
        <>
          <table style={{ marginBottom: 10 }}>
            <thead />
            <tbody>
              <tr>
                {legends.map(({ mots: [mot] }) => {
                  if (mot === null) {
                    return null;
                  }
                  return (
                    <td key={mot}>
                      <GeltungsbereicheLegend mot={mot} valid={50} />
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
          <>
            <Typography paragraph className={classes.firstLetter}>
              <b>{t(layer.name)}</b>: {t(reduced)}
            </Typography>
          </>
          <br />
          <br />
        </>
      )}
      <table style={{ marginBottom: 10 }}>
        <thead />
        <tbody>
          <tr>
            <td>
              <GeltungsbereicheLegend />
            </td>
          </tr>
        </tbody>
      </table>
      <Typography paragraph>{t('Keine Ermässigung')}</Typography>
      <table style={{ marginBottom: 10 }}>
        <thead />
        <tbody>
          <tr>
            <td>
              <GeltungsbereicheLegend valid={-1} />
            </td>
          </tr>
        </tbody>
      </table>
      <Typography paragraph>{t('Gültigkeit vor Ort erfragen')}</Typography>
      <br />
      <br />
    </div>
  );
};

GeltungsbereicheLayerInfo.propTypes = {
  properties: PropTypes.instanceOf(Layer).isRequired,
};

GeltungsbereicheLayerInfo.renderTitle = (layer, t) => {
  return t('ch.sbb.geltungsbereiche'); // - ${t(`${layer.name || layer.key}`)}`;
};

export default GeltungsbereicheLayerInfo;
