import React from 'react';
import PropTypes from 'prop-types';
import DataLink from '../../components/DataLink';

const translations = {
  de: {
    title: 'Infrastrukturbetreiberinnen',
    description:
      'Die Karte der Normalspur-Infrastrukturbetreiberinnen zeigt farblich unterscheidbar deren geographische Ausbreitung. Beim Anklicken einer Strecke öffnen sich weitere Informationen, insbesondere zum Netzzugang als Eisenbahnverkehrsunternehmen.',
    responsible: 'Verantwortlich',
    responsibleContent: 'SBB Infrastruktur - Netzzugang',
  },
  fr: {
    title: "Gestionnaires d'infrastructure",
    description:
      "La carte des gestionnaires d'infrastructure à voie normale montre, par des couleurs distinctes, leur extension géographique. En cliquant sur une ligne, des informations supplémentaires s'ouvrent, notamment sur l'accès au réseau en tant qu'entreprise de transport ferroviaire.",
    responsible: 'Responsable',
    responsibleContent: 'CFF Infrastructure - Accès au réseau',
  },
  en: {
    title: 'Infrastructure managers',
    description:
      'The map of the standard gauge infrastructure managers shows their geographical spread in different colours. Clicking on a route opens further information, in particular on network access as a railway undertaking.',
    responsible: 'Responsible',
    responsibleContent: 'SBB Infrastructure - Network Access',
  },
  it: {
    title: 'Gestori dell’infrastruttura',
    description:
      "La cartina dei gestori di infrastrutture a scartamento normale mostra la loro diffusione geografica in diversi colori. Cliccando su un percorso si aprono ulteriori informazioni, in particolare sull'accesso alla rete come impresa ferroviaria.",
    responsible: 'Responsabile',
    responsibleContent: 'FFS Infrastruttura - Accesso alla rete',
  },
};

const propTypes = {
  language: PropTypes.string.isRequired,
};

function IsbTopicInfo({ language }) {
  const { title, description, responsible, responsibleContent } =
    translations[language];
  return (
    <div>
      <p>{title}</p>
      <p>{description}</p>
      <p>
        {responsible}:
        <br />
        {responsibleContent},
        <br />
        <a href="mailto:netzzugang@sbb.ch">netzzugang@sbb.ch</a>.
      </p>
      <hr />
      <p>
        <DataLink
          fullWidth={false}
          href="https://data.sbb.ch/explore/dataset/infrastrukturbetreiberinnen/information/"
        />
      </p>
    </div>
  );
}

IsbTopicInfo.propTypes = propTypes;

export default React.memo(IsbTopicInfo);
