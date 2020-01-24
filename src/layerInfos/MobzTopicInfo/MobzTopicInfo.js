import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
};

const defaultProps = {};

const MobzTopicInfo = ({ language, t, properties }) => {
  const { infos } = properties;
  const desc = {
    de: (
      <span>
        Multimodale Umsteigedrehscheiben des öffentlichen Personenverkehrs.
        Möglichst attraktive Umsteigebeziehungen zwischen der Bahn und der
        Anschlussmobilität mit zum Teil auch neuen Verkehrsträgern. Auf Stärken
        der Bahn in der Reisekette setzen und diese weiter ausbauen.
      </span>
    ),
    fr: (
      <span>
        Plaques tournantes multimodales (correspondances) du trafic voyageurs
        par les transports publics. Liaisons aussi attrayantes que possible
        entre le rail et la mobilité combinée, avec des modes de transport en
        partie nouveaux. S’appuyer sur les atouts du chemin de fer dans la
        chaîne de voyage et continuer à les renforcer.
      </span>
    ),
    it: (
      <span>
        Nodo multimodale di cambio del trasporto pubblico viaggiatori.
        Interessanti coincidenze per il cambio tra ferrovia e mobilità
        combinata, in parte anche con nuovi modi di trasporto. Puntare sui punti
        di forza della ferrovia nella catena di viaggio per ampliarla
        ulteriormente.
      </span>
    ),
  };

  return (
    <div>
      {desc[language] ? desc[language] : desc.de}
      <p>
        {t('Aktualisierungs-Zyklus')}:
        <br />
        {t('bei Bedarf')}
      </p>
      <p>
        {t('Verantwortlich')}:
        <br />
        {infos.owner},
        <br />
        <a href={`mailto:${infos.email}`}>{infos.email}</a>.
      </p>
    </div>
  );
};

MobzTopicInfo.propTypes = propTypes;
MobzTopicInfo.defaultProps = defaultProps;

export default compose(withTranslation())(MobzTopicInfo);
