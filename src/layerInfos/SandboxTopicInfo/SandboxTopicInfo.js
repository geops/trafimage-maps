import React from 'react';
import PropTypes from 'prop-types';

const translations = {
  de: {
    'ch.sbb.netzkarte.sandbox-desc':
      'Über die Sandbox können Weiterentwicklungen (Styles, Ebenen, Inhalte usw.) einem breiten Publikum als Pilot oder Demo-Version präsentiert werden. Die Inhalte der Sandbox können sich laufend ändern. Die Aktualität und Richtigkeit der Daten ist in der Sandbox nicht garantiert.',
    'SBB AG, Product Owner Trafimage': 'SBB AG, Product Owner Trafimage',
    'trafimage@sbb.ch': 'trafimage@sbb.ch',
    Verantwortlich: 'Verantwortlich',
  },
  fr: {
    'ch.sbb.netzkarte.sandbox-desc':
      "Le bac à sable peut être utilisé pour présenter des développements ultérieurs (styles, niveaux, contenu, etc.) à un large public sous forme de version pilote ou de démonstration. Le contenu du bac à sable peut changer en permanence. L'actualité et l'exactitude des données ne sont pas garanties dans le bac à sable.",
    'SBB AG, Product Owner Trafimage': 'CFF SA, Product Owner Trafimage',
    'trafimage@sbb.ch': 'trafimage@cff.ch',
    Verantwortlich: 'Responsable',
  },
  en: {
    'ch.sbb.netzkarte.sandbox-desc':
      'The sandbox can be used to present further developments (styles, layers, content, etc.) to a broad audience as a pilot or demo version. The contents of the sandbox can change continuously. The up-to-dateness and correctness of the data is not guaranteed in the sandbox.',
    'SBB AG, Product Owner Trafimage': 'SBB AG, Product Owner Trafimage',
    'trafimage@sbb.ch': 'trafimage@sbb.ch',
    Verantwortlich: 'Responsible',
  },
  it: {
    'ch.sbb.netzkarte.sandbox-desc':
      "La sandbox può essere utilizzata per presentare ulteriori sviluppi (stili, livelli, contenuti, ecc.) a un vasto pubblico come versione pilota o demo. Il contenuto della sandbox può cambiare continuamente. L'attualità e la correttezza dei dati non sono garantite nella sandbox.",
    'SBB AG, Product Owner Trafimage': 'FFS SA, Product Owner Trafimage',
    'trafimage@sbb.ch': 'trafimage@ffs.ch',
    Verantwortlich: 'Responsabile',
  },
};
const propTypes = {
  language: PropTypes.string.isRequired,
};

const SandboxTopicInfo = ({ language }) => {
  return (
    <div>
      {translations[language]['ch.sbb.netzkarte.sandbox-desc']}
      <p>
        {translations[language].Verantwortlich}:
        <br />
        {translations[language]['SBB AG, Product Owner Trafimage']},
        <br />
        Daniel Hofstetter,&nbsp;
        <a href={`mailto:${translations[language]['trafimage@sbb.ch']}`}>
          {translations[language]['trafimage@sbb.ch']}
        </a>
        .
      </p>
    </div>
  );
};

SandboxTopicInfo.propTypes = propTypes;

export default SandboxTopicInfo;
