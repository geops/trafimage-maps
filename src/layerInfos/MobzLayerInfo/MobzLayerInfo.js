import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  infos: PropTypes.object.isRequired,
};

const defaultProps = {};

const MobzLayerInfo = ({ t, language, infos }) => {
  const config = infos.get('mobz');
  const { category } = config;

  const regionalKey = 'Regional-Hubs';
  const updateCycle =
    category === regionalKey ? t('bei Bedarf') : t('1 pro Jahr');

  const img = (
    <img
      src={`${process.env.REACT_APP_STATIC_FILES_URL}/img/layers/mobz/${category}.png`}
      draggable="false"
      alt={t('Kein Bildtext')}
    />
  );

  const desc = {
    'Hauptzentrums-Hubs': {
      de: (
        <span>
          Hauptzentrums-Hubs: Hauptverkehrsdrehscheiben in den grössten Städten
          der Schweiz, sehr leistungsfähiger Umstieg auf den Feinverteiler
          (primär Tram und Bus).
        </span>
      ),
      fr: (
        <span>
          Hubs centraux principaux: principales plaques tournantes du trafic
          dans les plus grandes villes de Suisse; passage très efficace à la
          distribution fine (essentiellement tramway et bus).
        </span>
      ),
      en: (
        <span>
          Hauptzentrums-Hubs: Hauptverkehrsdrehscheiben in den grössten Städten
          der Schweiz, sehr leistungsfähiger Umstieg auf den Feinverteiler
          (primär Tram und Bus).
        </span>
      ),
      it: (
        <span>
          Hub dei centri principali: principali nodi di traffico nelle maggiori
          città della Svizzera, cambio molto efficiente verso la distribuzione
          capillare (innanzitutto tram e autobus).
        </span>
      ),
    },
    Umsteigebahnhof: {
      de: (
        <span>
          Umsteigebahnhöfe Bahn-Bahn: Bei dieser Kategorie handelt es sich um
          national wichtige Umsteigebahnhöfe Bahn-Bahn. Der im Vergleich zur
          lokalen Erschliessung und der Anschlussmobilität (mit anderen
          Verkehrsträgern) hohe Anteil Umsteiger Bahn-Bahn ergibt sich aus einer
          übergeordneten Funktion im Netz und in der Angebotskonzeption
          (insbesondere nationale Taktknoten).
        </span>
      ),
      fr: (
        <span>
          Gares de changement train-train: cette catégorie concerne les gares de
          changement train-train d’importance nationale. La part élevée de
          voyageurs avec correspondance train-train par rapport à la desserte
          locale et à la mobilité combinée (avec d’autres modes de transport)
          résulte d’une fonction de niveau supérieur dans le réseau et dans la
          conception de l’offre (en particulier les nœuds de cadencement
          nationaux).
        </span>
      ),
      en: (
        <span>
          Umsteigebahnhöfe Bahn-Bahn: Bei dieser Kategorie handelt es sich um
          national wichtige Umsteigebahnhöfe Bahn-Bahn. Der im Vergleich zur
          lokalen Erschliessung und der Anschlussmobilität (mit anderen
          Verkehrsträgern) hohe Anteil Umsteiger Bahn-Bahn ergibt sich aus einer
          übergeordneten Funktion im Netz und in der Angebotskonzeption
          (insbesondere nationale Taktknoten).
        </span>
      ),
      it: (
        <span>
          Stazioni di cambio treno-treno: Questa categoria è composta da
          stazioni di cambio treno-treno di rilievo nazionale. L’elevata
          percentuale di passeggeri con cambio treno-treno rispetto ai trasporti
          locali e alla mobilità combinata (con altri sistemi di trasporto)
          deriva dal ruolo di primo piano che la ferrovia ricopre nella rete e
          nella pianificazione dell’offerta (in particolare nodi di rilievo
          nazionale integrati nella cadenza).
        </span>
      ),
    },
    'Agglomerations-Hubs': {
      de: (
        <span>
          Agglomerations-Hubs: Assoziierte Verkehrsdrehscheiben (mit
          Entlastungsfunktion) zu Hauptzentrums-Hubs, liegen typischerweise in
          vorstädtischen Verdichtungsgebieten, sehr gute Anbindung an den
          Nahverkehr (Feinverteiler).
        </span>
      ),
      fr: (
        <span>
          Hubs d’agglomération: plaques tournantes du trafic associées aux hubs
          centraux principaux et destinées à les soulager; hubs typiquement
          situés dans des zones suburbaines à forte densité de population; très
          bonne connexion avec les modes de transport locaux (distribution
          fine).
        </span>
      ),
      en: (
        <span>
          Agglomerations-Hubs: Assoziierte Verkehrsdrehscheiben (mit
          Entlastungsfunktion) zu Hauptzentrums-Hubs, liegen typischerweise in
          vorstädtischen Verdichtungsgebieten, sehr gute Anbindung an den
          Nahverkehr (Feinverteiler).
        </span>
      ),
      it: (
        <span>
          Hub degli agglomerati: nodi di traffico associati (con funzione di
          decongestionamento) verso gli hub dei centri principali, si trovano
          tipicamente in aree suburbane densamente popolate, ottimamente
          collegati al traffico locale (distribuzione capillare).
        </span>
      ),
    },
    Stadtbahnhof: {
      de: (
        <span>
          Stadtbahnhof: Bei dieser Kategorie handelt es sich um eine
          Unterkategorie der Agglomerationshubs. Stadtbahnhöfe übernehmen
          ebenfalls eine wichtige Erschliessungsfunktion in grossen Städten. Im
          Gegensatz zu den Agglomerations-Hubs stellen Stadtbahnhöfe die
          Erschliessung primär im lokalen Bereich (Stadtquartier) mit einem
          nahen Einzugsgebiet sicher.
        </span>
      ),
      fr: (
        <span>
          Gare urbaine: cette catégorie est une sous-catégorie des hubs
          d’agglomérations. Les gares urbaines jouent également un rôle de
          desserte important dans les grandes villes. Contrairement aux hubs
          d’agglomérations, les gares urbaines assurent la desserte
          principalement dans l’espace local (quartier urbain) avec une zone
          d’attraction proche.
        </span>
      ),
      en: (
        <span>
          Stadtbahnhof: Bei dieser Kategorie handelt es sich um eine
          Unterkategorie der Agglomerationshubs. Stadtbahnhöfe übernehmen
          ebenfalls eine wichtige Erschliessungsfunktion in grossen Städten. Im
          Gegensatz zu den Agglomerations-Hubs stellen Stadtbahnhöfe die
          Erschliessung primär im lokalen Bereich (Stadtquartier) mit einem
          nahen Einzugsgebiet sicher.
        </span>
      ),
      it: (
        <span>
          Stazioni ferroviarie cittadine: Questa categoria è una sottocategoria
          degli hub d’agglomerato. Le stazioni urbane svolgono anche
          un’importante funzione di collegamento nelle grandi città. A
          differenza degli hub d’agglomerato, le stazioni urbane garantiscono il
          collegamento soprattutto a livello locale (quartiere urbano) per un
          bacino d’utenza vicino.
        </span>
      ),
    },
    'Zentrum-Hubs': {
      de: (
        <span>
          Zentrums-Hubs: Verkehrsdrehscheiben in mittelgrossen Städten / Zentren
          von mittelgrossen Agglomerationen, Anbindung an hochwertigen Orts- und
          Nahverkehr.
        </span>
      ),
      fr: (
        <span>
          Hubs centraux: plaques tournantes du trafic dans des villes/centres de
          taille moyenne au sein d’agglomérations également moyennes; connexion
          avec les transports locaux et suburbains de qualité.
        </span>
      ),
      en: (
        <span>
          Zentrums-Hubs: Verkehrsdrehscheiben in mittelgrossen Städten / Zentren
          von mittelgrossen Agglomerationen, Anbindung an hochwertigen Orts- und
          Nahverkehr.
        </span>
      ),
      it: (
        <span>
          Hub centrali: nodi di traffico in città di medie dimensioni / centri
          di agglomerati di medie dimensioni, collegamento di qualità al
          traffico locale e urbano.
        </span>
      ),
    },
    [regionalKey]: {
      de: (
        <span>
          Regional-Hubs: Verkehrsdrehscheiben von regionaler Bedeutung.
          Anschlussmobilitätsangebote für die Bedienung des Einzugsgebietes
          werden an diesen Standorten konzentriert und das Einzugsgebiet
          vergrössert sich langfristig.
        </span>
      ),
      fr: (
        <span>
          Hubs régionaux: plaques tournantes du trafic d’importance régionale;
          interconnexion des offres de mobilité pour la desserte du bassin
          versant concentrée sur ces sites; augmentation de l’étendue du bassin
          versant à long terme.
        </span>
      ),
      en: (
        <span>
          Regional-Hubs: Verkehrsdrehscheiben von regionaler Bedeutung.
          Anschlussmobilitätsangebote für die Bedienung des Einzugsgebietes
          werden an diesen Standorten konzentriert und das Einzugsgebiet
          vergrössert sich langfristig.
        </span>
      ),
      it: (
        <span>
          Hub regionali: nodi di traffico di importanza regionale. In tali sedi
          verranno concentrate offerte di mobilità per collegare il bacino
          d’utenza, il quale si estenderà nel tempo.
        </span>
      ),
    },
  };

  return (
    <div className="wkp-mobz-layer-info">
      <div>
        {img}
        {desc[category][language]}
      </div>
      <p>
        {t('Aktualisierungs-Zyklus')}: {updateCycle}
      </p>
    </div>
  );
};

MobzLayerInfo.propTypes = propTypes;
MobzLayerInfo.defaultProps = defaultProps;

export default compose(withTranslation())(MobzLayerInfo);
