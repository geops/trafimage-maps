import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Divider, Typography, makeStyles } from '@material-ui/core';
import { Layer } from 'mobility-toolbox-js/ol';
import GeltungsbereicheLegend, {
  legends,
} from '../../popups/GeltungsbereicheGaPopup/GeltungsbereicheLegend';

const useStyles = makeStyles(() => ({
  lowerCase: {
    '&::first-letter': {
      textTransform: 'lowercase',
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
  const products = layer.get('products');
  const productsRemark = layer.get('productsRemark');
  return (
    <div style={{ maxHeight: 450 }}>
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
        <Typography paragraph>
          {products.map((p, idx, arr) => (
            <b
              key={p}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `${t(p)}${idx !== arr.length - 1 ? ', ' : ''}`, // We don't use .join() because of html parsing for line breaks
              }}
            />
          ))}
          {productsRemark ? (
            <b>
              , <span className={classes.lowerCase}>{t(productsRemark)}</span>
            </b>
          ) : (
            ''
          )}
          : {t(full)}
        </Typography>
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
            <Typography paragraph>
              {products.map((p, idx, arr) => (
                <b
                  key={p}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: `${t(p)}${idx !== arr.length - 1 ? ', ' : ''}`, // We don't use .join() because of html parsing for line breaks
                  }}
                />
              ))}
              {productsRemark ? (
                <b>
                  ,{' '}
                  <span className={classes.lowerCase}>{t(productsRemark)}</span>
                </b>
              ) : (
                ''
              )}
              : {t(reduced)}
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
              <GeltungsbereicheLegend mot="ferry" valid={-1} />
            </td>
          </tr>
        </tbody>
      </table>
      <Typography paragraph>{t('Gültigkeit vor Ort erfragen')}</Typography>
      <br />
      <Divider />
      <br />
      <br />
      <Typography paragraph>
        <i>{t('ch.sbb.geltungsbereiche.layerinfo-footer')}</i>
      </Typography>
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
