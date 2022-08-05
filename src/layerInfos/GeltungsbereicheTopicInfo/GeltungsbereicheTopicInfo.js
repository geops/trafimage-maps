import React from 'react';
import { useTranslation } from 'react-i18next';

const comps = {
  de: (
    <div>
      Diese Karte zeigt die Geltungsbereiche verschiedener Abo-Produkte auf dem
      Schweizer öV-Netz. Die Daten sind der NOVA-Datenbank entnommen. Die Karte
      befindet sich in einem experimentellen Status. Die grafische Darstellung
      sowie die Bedienung der Webkarte sind noch nicht optimiert. Die
      abgebildeten Daten sind nicht verbindlich.
    </div>
  ),
  fr: (
    <div>
      Cette carte présente les zones de validité des différents produits
      d&apos;abonnement sur le réseau suisse des transports publics. Les données
      sont extraites de la base de données NOVA. La carte est dans un état
      expérimental. L&apos;affichage graphique et le fonctionnement de la carte
      Web n&apos;ont pas encore été optimisés. Les données présentées ne sont
      pas contractuelles.
    </div>
  ),
  it: (
    <div>
      Questa mappa mostra i campi di validità di diversi prodotti in abbonamento
      sulla rete dei trasporti pubblici svizzeri. I dati sono presi dal database
      NOVA. La mappa è in uno stato sperimentale. La visualizzazione grafica e
      il funzionamento della mappa web non sono ancora stati ottimizzati. I dati
      riportati non sono vincolanti.
    </div>
  ),
  en: (
    <div>
      This map shows the areas of validity of various subscription products on
      the Swiss public transport network. The data are taken from the NOVA
      database. The map is in an experimental state. The graphic display and the
      operation of the web map have not yet been optimized. The data shown are
      not binding.
    </div>
  ),
};

const GeltungsbereicheTopicInfo = () => {
  const { i18n } = useTranslation();
  return (
    <div>
      <div>{comps[i18n.language]}</div>
    </div>
  );
};

export default GeltungsbereicheTopicInfo;
