import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};

const defaultProps = {};

const desc = {
  de: (
    <span>
      Die Netzkarte richtet sich an die Nutzerinnen und Nutzer des öffentlichen
      Verkehrs. Es handelt sich um eine Basiskarte auf der Grundlage von
      Fahrplandaten. Direkt auf der Karte können mit einem Klick auf die
      gewünschte Station die entsprechenden Informationen abgefragt werden.
      Unter Layer gibt es weitere Inhalte, die auf der Karte abgebildet werden
      können.
    </span>
  ),
  fr: (
    <span>
      La carte du réseau est destinée aux utilisatrices et utilisateurs des
      transports publics. Il s’agit d’une carte de base reposant sur les données
      horaire. Il est possible de consulter les informations relatives à une
      gare donnée en cliquant directement sur la carte. D’autres contenus
      pouvant être représentés sur la carte figurent sous «Couche».
    </span>
  ),
  en: (
    <span>
      The network map is aimed at public transport users. It is a basic map
      derived from timetable data. Relevant information can be accessed directly
      from the map by clicking on the required station. Under Layer, there is
      further content which can be displayed on the map.
    </span>
  ),
  it: (
    <span>
      La carta di rete è destinata agli utenti dei trasporti pubblici. Si tratta
      di una cartina di base che fa riferimento ai dati dell’orario. È
      sufficiente fare clic sulla stazione desiderata direttamente sulla cartina
      per consultare le informazioni corrispondenti. Alla voce «Layer» sono
      disponibili ulteriori contenuti che possono essere visualizzati sulla
      carta.
    </span>
  ),
};

const NetzkarteTopicInfo = ({ language, t }) => {
  return (
    <div>
      {desc[language]}
      <p>
        {t('Verantwortlich')}:
        <br />
        {t('SBB AG, Product Owner Trafimage')},
        <br />
        Daniel Hofstetter,&nbsp;
        <a href={`mailto:${t('trafimage@sbb.ch')}`}>{t('trafimage@sbb.ch')}</a>.
      </p>
    </div>
  );
};

NetzkarteTopicInfo.propTypes = propTypes;
NetzkarteTopicInfo.defaultProps = defaultProps;

export default compose(withTranslation())(NetzkarteTopicInfo);
