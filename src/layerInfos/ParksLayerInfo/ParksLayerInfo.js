import React from 'react';

const comps = {
  de: (
    <div>
      Alle Schweizer Pärke von nationaler Bedeutung auf einen Blick. Es werden
      nur Pärke in Betrieb gezeigt.
      <p>
        Daten:&nbsp;
        <a
          href="http://www.parks.swiss"
          rel="noopener noreferrer"
          target="_blank"
        >
          www.parks.swiss
        </a>
        .
      </p>
    </div>
  ),
  fr: (
    <div>
      Aperçu de tous les parcs suisses d’importance nationale. Seuls les parcs
      en gestion sont affichés.
      <p>
        Données:&nbsp;
        <a
          href="http://www.parks.swiss/fr"
          rel="noopener noreferrer"
          target="_blank"
        >
          www.parks.swiss/fr
        </a>
        .
      </p>
    </div>
  ),
  en: (
    <div>
      All Swiss parks of national importance at a glance. Only parks which are
      currently in use are shown.
      <p>
        Data:&nbsp;
        <a
          href="http://www.parks.swiss/en"
          rel="noopener noreferrer"
          target="_blank"
        >
          www.parks.swiss/en
        </a>
        .
      </p>
    </div>
  ),
  it: (
    <div>
      Tutti i parchi di rilevanza nazionale nel territorio elvetico. Vengono
      mostrati solo i parchi aperti.
      <p>
        Dati:&nbsp;
        <a
          href="http://www.parks.swiss/it"
          rel="noopener noreferrer"
          target="_blank"
        >
          www.parks.swiss/it
        </a>
        .
      </p>
    </div>
  ),
};

const ParksLayerInfo = ({ language }) => {
  return comps[language];
};

export default React.memo(ParksLayerInfo);
