import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
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

const ReducedScopeInfo = () => {
  const { t } = useTranslation();
  return (
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
        <b>{t('Tageskarte zum Halbtax')}</b>: {t('Fahrt zum ermässigten Preis')}
      </Typography>
      <Typography paragraph>
        <b>
          {t('Tageskarte Gemeinde')}, {t('Spartageskarte')} {t('und')}{' '}
          {t('Aktionstageskarte')} {t('ohne GA/Halbtax-Abo')}
        </b>
        : {t('Fahrt zum ganzen Preis')}
      </Typography>
    </>
  );
};

const FullScopeInfo = () => {
  const { t } = useTranslation();
  return (
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
};

const GeltungsbereicheLayerInfo = () => {
  const { t } = useTranslation();
  return (
    <div style={{ maxHeight: 450 }}>
      {/* <Typography paragraph>{comps[i18n.language]}</Typography> */}

      {legends.map(({ mots: [mot], validity }) => {
        if (mot === null) {
          return null;
        }
        return (
          <table style={{ marginBottom: 10 }}>
            {validity.map(({ value }, index) => {
              return (
                <tr>
                  <td>
                    <GeltungsbereicheLegend mot={mot} valid={value} />
                  </td>
                  {index === 0 && (
                    <td rowSpan={validity.length}>{t(`gb.mot.${mot}`)}</td>
                  )}
                </tr>
              );
            })}
          </table>
        );
      })}
      <br />
      <br />

      <table style={{ marginBottom: 10 }}>
        <tr>
          {legends.map(({ mots: [mot] }) => {
            if (mot === null) {
              return null;
            }
            return (
              <td>
                <GeltungsbereicheLegend mot={mot} valid={100} />
              </td>
            );
          })}
        </tr>
      </table>
      <FullScopeInfo />
      <br />
      <br />
      <table style={{ marginBottom: 10 }}>
        <tr>
          {legends.map(({ mots: [mot] }) => {
            if (mot === null) {
              return null;
            }
            return (
              <td>
                <GeltungsbereicheLegend mot={mot} valid={50} />
              </td>
            );
          })}
        </tr>
      </table>
      <ReducedScopeInfo />
      <br />
      <br />
      <table style={{ marginBottom: 10 }}>
        <tr>
          <td>
            <GeltungsbereicheLegend />
          </td>
        </tr>
      </table>
      <Typography paragraph>{t('Keine Ermässigung')}</Typography>
      <br />
      <br />
    </div>
  );
};

export default GeltungsbereicheLayerInfo;
