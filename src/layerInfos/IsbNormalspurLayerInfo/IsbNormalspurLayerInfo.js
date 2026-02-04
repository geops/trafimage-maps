import React from "react";
import PropTypes from "prop-types";
import { Layer } from "mobility-toolbox-js/ol";
import useTranslation from "../../utils/useTranslation";
import OperatorShortAndLongName from "../IsbTVSLayerInfo/OperatorShortAndLongName";

const propTypes = {
  properties: PropTypes.instanceOf(Layer).isRequired,
};

const translations = {
  de: {
    description: (
      <>
        <p>Infrastrukturbetreiberinnen, die Normalspurstrecken betreiben.</p>
        <p>
          Die vorliegende Trafimage-Karte dient der visuellen Darstellung der
          Grenzen zwischen den Infrastrukturbetreiberinnen der
          Normalspurstrecken. Technisch oder kartografisch bedingte Abweichungen
          sind möglich. Verbindlich sind ausschliesslich die vertraglich
          festgelegten Netzanschlusspunkte zwischen den
          Infrastrukturbetreiberinnen.
        </p>
        <p>Besonders zu beachten:</p>
        <p>Netzanschlusspunkt SBB/SSB Schweizerhalle:</p>
        <ul>
          <li>Km 8.062, nördliches Widerlager der Autobahnbrücke</li>
        </ul>
        <p>Netzanschlusspunkt SOB/SBB bei Wattwil ab 01.01.2026:</p>
        <ul>
          <li>Bis vor Tunneleinfahrt nur SOB (beige)</li>
          <li>
            Ab Tunneleinfahrt (gestrichelte Linie) Richtung Kaltbrunn SBB (rot).
          </li>
        </ul>
        <p>Netzanschlusspunkt BLS/SBB Bern ab 01.01.2026</p>
        <p>Beim Spurwechsel bei km BLS 1.118,</p>
        <ul>
          <li>Richtung Bern SBB (rot)</li>
          <li>Richtung Bern West bis Holligen BLSN/SBB (grün/rot)</li>
        </ul>
        <p>AMEG–Annemasse Grenze ISB SBB/SNCF, km 75.770</p>
      </>
    ),
    dataInfo1: "Datengrundlage: SBB",
    dataInfo2: "Datenstand: Dezember 2025",
  },
  fr: {
    description: (
      <>
        <p>
          Les gestionnaires d&apos;infrastructure qui exploitent des lignes à
          voie normale.
        </p>
        <p>
          La présente carte Trafimage sert à représenter visuellement les
          limites entre les gestionnaires d&apos;infrastructure des lignes à
          voie normale. Des écarts peuvent être possibles sur le plan technique
          ou cartographique. Seuls les points de raccordement au réseau définis
          contractuellement entre les gestionnaires d&apos;infrastructure sont
          contraignants.
        </p>
        <p>À noter en particulier:</p>
        <p>Point de raccordement au réseau des CFF Schweizerhalle:</p>
        <ul>
          <li>Km 8,062 Culée nord du pont autoroutier</li>
        </ul>
        <p>
          Point de raccordement au réseau du SOB près de Wattwil à partir du 1er
          janvier 2026:
        </p>
        <ul>
          <li>
            Jusqu&apos;à l&apos;entrée dans le tunnel, uniquement SOB (beige)
          </li>
          <li>
            Depuis l&apos;entrée du tunnel (ligne en pointillés) en direction de
            Kaltbrunn CFF (rouge).
          </li>
        </ul>
        <p>
          Point de raccordement au réseau BLS/CFF Berne à partir du 1er janvier
          2026
        </p>
        <p>Sur la diagonale d&apos;échange au km BLS 1,118</p>
        <ul>
          <li>Direction Bern CFF (rouge)</li>
          <li>
            En direction de Bern West jusqu&apos;à Holligen BLSN/CFF
            (vert/rouge)
          </li>
        </ul>
        <p>AMEG - Annemasse Frontière GI CFF/SNCF, km 75.770</p>
      </>
    ),
    dataInfo1: "Base de données: CFF",
    dataInfo2: "État des données: Décembre 2025",
  },
  it: {
    description: (
      <>
        <p>
          Gestori di infrastrutture che operano su linee a scartamento normale.
        </p>
        <p>
          La presente carta Trafimage serve a rappresentare visivamente i
          confini tra i gestori dell&apos;infrastruttura delle tratte a
          scartamento normale. Sono possibili scostamenti tecnici o
          cartografici. Sono vincolanti esclusivamente i punti di collegamento
          alla rete stabiliti contrattualmente tra i gestori
          dell&apos;infrastruttura.
        </p>
        <p>Prestare particolare attenzione a quanto segue:</p>
        <p>Punto di raccordo alla rete FFS Schweizerhalle:</p>
        <ul>
          <li>Km 8.062 Spalla nord del ponte dell&apos;autostrada</li>
        </ul>
        <p>
          Punto di raccordo alla rete SOB presso Wattwil dal 1 gennaio 2026:
        </p>
        <ul>
          <li>Fino a prima dell&apos;entrata in galleria solo SOB (beige)</li>
          <li>
            Dall&apos;ingresso della galleria (linea tratteggiata) in direzione
            di Kaltbrunn FFS (rossa).
          </li>
        </ul>
        <p>Punto di raccordo alla rete BLS/FFS Berna dal 1 gennaio 2026</p>
        <p>In corrispondenza del cambio di binario al km BLS 1.118</p>
        <ul>
          <li>Direzione Berna FFS (rosso)</li>
          <li>
            In direzione di Berna Ovest fino a Holligen BLSN/FFS (verde/rosso)
          </li>
        </ul>
        <p>AMEG–Annemasse Confine GI FFS/SNCF, km 75.770</p>
      </>
    ),
    dataInfo1: "Base dati: FFS",
    dataInfo2: "Aggiornamento dei dati: Dicembre 2025",
  },
  en: {
    description: (
      <>
        <p>Infrastructure managers who operate standard gauge lines.</p>
        <p>
          This Trafimage map is intended to visualise the boundaries between the
          infrastructure managers on standard gauge lines. Deviations are
          possible for technical or cartographical reasons. Only the network
          connection points specified by contract between the infrastructure
          managers are binding.
        </p>
        <p>Particular attention should be paid to:</p>
        <p>SBB Schweizerhalle network connection point:</p>
        <ul>
          <li>Km 8.062 North abutment of the motorway bridge</li>
        </ul>
        <p>SOB network connection point near Wattwil from 1 January 2026:</p>
        <ul>
          <li>Only SOB (beige) before entering the tunnel</li>
          <li>
            From the tunnel entrance (dashed line) towards Kaltbrunn SBB (red).
          </li>
        </ul>
        <p>BLS/SBB Bern network connection point from 1 January 2026</p>
        <p>At the cross-over at BLS 1.118 km.</p>
        <ul>
          <li>Towards Bern SBB (red)</li>
          <li>Direction Bern West to Holligen BLSN/SBB (green/red)</li>
        </ul>
        <p>AMEG–Annemasse border IM SBB/SNCF, km 75.770</p>
      </>
    ),
    dataInfo1: "Data basis: SBB",
    dataInfo2: "Data status: December 2025",
  },
};

function IsbNormalspurLayerInfo({ properties: layer }) {
  const { i18n } = useTranslation();
  const { description, dataInfo1, dataInfo2 } = translations[i18n.language];
  const shortToLongName = Object.entries(
    layer.get("shortToLongName") || {},
  ).sort(([key1], [key2]) =>
    key1.toUpperCase() < key2.toUpperCase() ? -1 : 1,
  );

  return (
    <div>
      {description}
      <hr style={{ margin: "20px 0" }} />
      {shortToLongName.map(([shortName, longName]) => {
        return (
          <OperatorShortAndLongName
            key={shortName}
            shortName={shortName}
            longName={longName}
          />
        );
      })}
      <hr style={{ margin: "20px 0" }} />

      <p>
        {dataInfo1}
        <br />
        {dataInfo2}
      </p>
    </div>
  );
}

IsbNormalspurLayerInfo.propTypes = propTypes;

export default React.memo(IsbNormalspurLayerInfo);
