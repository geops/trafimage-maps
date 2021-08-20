import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const cartaroURL = process.env.REACT_APP_CARTARO_URL;

const useStyles = makeStyles({
  title: {
    margin: '5px 0',
  },
  regionLegendItem: {
    display: 'flex',
    alignItems: 'center',
  },
  regionColor: {
    width: 30,
    height: 20,
    margin: 5,
    marginLeft: 0,
    border: '1px solid #767676',
  },
});

const propTypes = {
  layerName: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

const topicInfo = {
  de: (
    <>
      Übersicht der Zuständigkeiten der Netzentwicklung von I-NAT-NET für die
      Rollen Strecken + Knoten Planer, Netzentwickler Strategisch, Programm
      Manager, Fachführung Anlagen Güterverkehr. Die Karten enthalten zusätzlich
      Informationen über regionale Aufgaben (Leiter Netzentwicklung Region,
      Anforderungsmanager Netz).
      <br />
      <br />
      Verantwortlich: I-NAT-NET-UM, Christof Mahnig,{' '}
      <a href="mailto:christof.mahnig@sbb.ch">christof.mahnig@sbb.ch</a>
    </>
  ),
  fr: (
    <>
      Aperçu des responsabilités du développement du réseau I-NAT-NET pour les
      rôles de planificateur de lignes et de nœuds, développeur stratégique de
      réseau, manager de programme, conduite technique des installations fret.
      Les cartes contiennent en outre des informations sur les tâches régionales
      (chef de région Développement du réseau) et nationales (manager des
      exigences du réseau).
      <br />
      <br />
      Responsable: I-NAT-NET-UM, Christof Mahnig,{' '}
      <a href="mailto:christof.mahnig@sbb.ch">christof.mahnig@sbb.ch</a>
    </>
  ),
  it: (
    <>
      Visione delle responsabilità dello sviluppo della rete di I-NAT-NET per i
      ruoli di Pianificatore tratte&nodi, Sviluppatore rete strategico, Manager
      di programma, Gestione specialistica impianti traffico merci. Le mappe
      contengono ulteriori informazioni sui compiti regionali (dirigente
      sviluppo della rete regione) e nazionali (manager di requisiti della
      rete).
      <br />
      <br />
      Responsabile: I-NAT-NET-UM, Christof Mahnig,{' '}
      <a href="mailto:christof.mahnig@sbb.ch">christof.mahnig@sbb.ch</a>
    </>
  ),
};

const layerInfo = {
  'Programm Manager': {
    de: 'Programm Manager',
    fr: 'Manager de programme',
    it: 'Manager di programma',
  },
  'S&K Planer': {
    de: 'Strecken- und Knoten Planer',
    fr: 'Planificateur de lignes et de nœuds.',
    it: 'Pianificatore di tratte e nodi.',
  },
  'Fachführung Anlagen Güterverkehr': {
    de: 'Fachführung Anlagen Güterverkehr',
    fr: 'Conduite spécialisée des installations du trafic marchandises',
    it: 'Gestione specializzata di impianti per il traffico merci',
  },
  'Netzentwickler Strategisch': {
    de: 'Netzentwickler Strategisch',
    fr: 'Développeur stratégique de réseau',
    it: 'Sviluppatore della rete strategico',
  },
};

const NetzentwicklungLayerInfo = ({ language, layerName, t }) => {
  const [regions, setRegions] = useState();
  const classes = useStyles();

  useEffect(() => {
    if (layerName) {
      fetch(`${cartaroURL}netzentwicklung/region/items/`)
        .then((res) => res.json())
        .then((res) => setRegions(res));
    }
  }, [layerName]);

  return (
    <>
      <div className={classes.title}>
        {layerInfo[layerName] && layerInfo[layerName][language]}
      </div>
      {regions &&
        Array.isArray(regions) &&
        regions.map((region) => (
          <div className={classes.regionLegendItem}>
            <div
              className={classes.regionColor}
              style={{ backgroundColor: region.color }}
              key={region.id}
            />
            <div>{t(region.name)}</div>
          </div>
        ))}
      {!layerName && (topicInfo[language] || topicInfo.de)}
    </>
  );
};

NetzentwicklungLayerInfo.propTypes = propTypes;
export default NetzentwicklungLayerInfo;
