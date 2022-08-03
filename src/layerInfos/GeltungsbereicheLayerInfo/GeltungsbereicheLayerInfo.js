import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { Layer } from 'mobility-toolbox-js/ol';
import GeltungsbereicheLegend, {
  legends,
} from '../../popups/GeltungsbereicheGaPopup/GeltungsbereicheLegend';

// const comps = {
//   de: (
//     <div>
//       Diese Karte zeigt die Geltungsbereiche verschiedener Abo-Produkte auf dem
//       Schweizer öV-Netz. Die Daten sind der NOVA-Datenbank entnommen. Die Karte
//       befindet sich in einem experimentellen Status. Die grafische Darstellung
//       sowie die Bedienung der Webkarte sind noch nicht optimiert. Die
//       abgebildeten Daten sind nicht verbindlich.
//     </div>
//   ),
//   fr: (
//     <div>
//       Cette carte présente les zones de validité des différents produits
//       d&apos;abonnement sur le réseau suisse des transports publics. Les données
//       sont extraites de la base de données NOVA. La carte est dans un état
//       expérimental. L&apos;affichage graphique et le fonctionnement de la carte
//       Web n&apos;ont pas encore été optimisés. Les données présentées ne sont
//       pas contractuelles.
//     </div>
//   ),
//   it: (
//     <div>
//       Questa mappa mostra i campi di validità di diversi prodotti in abbonamento
//       sulla rete dei trasporti pubblici svizzeri. I dati sono presi dal database
//       NOVA. La mappa è in uno stato sperimentale. La visualizzazione grafica e
//       il funzionamento della mappa web non sono ancora stati ottimizzati. I dati
//       riportati non sono vincolanti.
//     </div>
//   ),
//   en: (
//     <div>
//       This map shows the areas of validity of various subscription products on
//       the Swiss public transport network. The data are taken from the NOVA
//       database. The map is in an experimental state. The graphic display and the
//       operation of the web map have not yet been optimized. The data shown are
//       not binding.
//     </div>
//   ),
// };

const GaReducedScopeInfo = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography paragraph>
        <b>
          {t('General-Abo')}, {t('seven25-Abo')}, {t('Tageskarte zum Halbtax')},{' '}
          {t('und')} {t('GA-Monatskarte mit Halbtax')}
        </b>
        : {t('Fahrt zum ermässigten Preis')}
      </Typography>
    </>
  );
};

const GaFullScopeInfo = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography paragraph>
        <b>
          {t('General-Abo')}, {t('seven25-Abo')}, {t('Tageskarte zum Halbtax')},{' '}
          {t('und')} {t('GA-Monatskarte mit Halbtax')}
        </b>
        : {t('Freie Fahrt')}
      </Typography>
    </>
  );
};

const TkFullScopeInfo = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography paragraph>
        <b>
          {t('Tageskarte Gemeinde')},{' '}
          {`${t('Spartageskarte ')} ${t('ohne GA/Halbtax-Abo')}`},{' '}
          {`${t('Aktionstageskarte ')} ${t('ohne GA/Halbtax-Abo')}`},{' '}
          {`${t('GA-Monatskarte ')} ${t('ohne Halbtax-Abo')}`}
        </b>
        : {t('Freie Fahrt')}
      </Typography>
    </>
  );
};

const HtaFullScopeInfo = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography paragraph>
        <b>{t('Halbtax')}</b>: {t('Fahrt zum ermässigten Preis')}
      </Typography>
    </>
  );
};

// const StsReduced25ScopeInfo = () => {
//   const { t } = useTranslation();
//   return (
//     <>
//       <Typography paragraph>
//         <b>SwissTravelPass</b>: {t('25% reduction')}
//       </Typography>
//     </>
//   );
// };

// const StsReduced50ScopeInfo = () => {
//   const { t } = useTranslation();
//   return (
//     <>
//       <Typography paragraph>
//         <b>SwissTravelPass</b>: {t('50% reduction')}
//       </Typography>
//     </>
//   );
// };

const StsReducedScopeInfo = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography paragraph>
        <b>Swiss Travel Pass</b>: {t('50% oder 25% reduction')}
      </Typography>
    </>
  );
};

const StsFullScopeInfo = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography paragraph>
        <b>Swiss Travel Pass</b>: {t('Freie Fahrt')}
      </Typography>
    </>
  );
};

const infos = {
  ga: {
    100: <GaFullScopeInfo />,
    50: <GaReducedScopeInfo />,
  },
  tk: {
    100: <TkFullScopeInfo />,
    // reduced: <TkReducedScopeInfo />,
  },
  hta: {
    100: <HtaFullScopeInfo />,
  },
  sts: {
    100: <StsFullScopeInfo />,
    50: <StsReducedScopeInfo />,
  },
};

const GeltungsbereicheLayerInfo = ({ properties: layer }) => {
  const { t } = useTranslation();
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
      {full}
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
          {reduced}
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
      <br />
      <br />
    </div>
  );
};

GeltungsbereicheLayerInfo.propTypes = {
  properties: PropTypes.instanceOf(Layer).isRequired,
};

export default GeltungsbereicheLayerInfo;
