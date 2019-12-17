import React from 'react';
import Link from '../../components/Link';

const comps = {
  de: (
    <div>
      Alle Schweizer Pärke von nationaler Bedeutung auf einen Blick. Es werden
      nur Pärke in Betrieb gezeigt.
      <p>
        Daten:&nbsp;
        <Link href="http://www.parks.swiss">www.parks.swiss</Link>
      </p>
    </div>
  ),
  fr: (
    <div>
      Aperçu de tous les parcs suisses d’importance nationale. Seuls les parcs
      en gestion sont affichés.
      <p>
        Données:&nbsp;
        <Link href="http://www.parks.swiss/fr">www.parks.swiss/fr</Link>
      </p>
    </div>
  ),
  en: (
    <div>
      All Swiss parks of national importance at a glance. Only parks which are
      currently in use are shown.
      <p>
        Data:&nbsp;
        <Link href="http://www.parks.swiss/en">www.parks.swiss/en</Link>
      </p>
    </div>
  ),
  it: (
    <div>
      Tutti i parchi di rilevanza nazionale nel territorio elvetico. Vengono
      mostrati solo i parchi aperti.
      <p>
        Dati:&nbsp;
        <Link href="http://www.parks.swiss/it">www.parks.swiss/it</Link>
      </p>
    </div>
  ),
};

const ParksLayerInfo = ({ language }) => {
  return comps[language];
};

export default React.memo(ParksLayerInfo);
