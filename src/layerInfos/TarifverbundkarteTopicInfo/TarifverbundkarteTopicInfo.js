import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

const TarifverbundkarteTopicInfo = ({ language, t }) => {
  const img = (
    <img
      src="/img/topics/tarifverbundkarte/tarifverbundkarte_legend.png"
      draggable="false"
      alt={t('Kein Bildtext')}
    />
  );

  const comps = {
    de: (
      <div>
        Die Verbund-Landschaft der Schweiz. Finden Sie das für Sie passende
        Pendler- und Freizeitabo im Tarifverbund Ihrer Region.
        <p>{img}</p>
        <p>
          Verantwortlich: SBB Personenverkehr – Marketing – Konzeption
          Regional/International
        </p>
      </div>
    ),
    fr: (
      <div>
        Les communautés tarifaires en Suisse: trouvez l’abonnement pendulaire
        et/ou loisirs qui vous convient dans la communauté tarifaire de votre
        région.
        <p>{img}</p>
        <p>
          Responsable: CFF Voyageurs – Marketing – Conception
          régional/international
        </p>
      </div>
    ),
    en: (
      <div>
        Switzerland’s network landscape. Find the right travelcard for you for
        commuting or leisure from your region’s fare network.
        <p>{img}</p>
        <p>
          Responsible: SBB Passenger Traffic – Marketing – Conception
          regional/international
        </p>
      </div>
    ),
    it: (
      <div>
        La cartina delle comunità tariffarie svizzere. Cercate l’abbonamento per
        pendolari o per il tempo libero più adatto a voi nella comunità
        tariffaria della vostra regione.
        <p>{img}</p>
        <p>
          Responsabile: FFS Viaggiatori – Marketing – Concezione
          regionale/internazionale
        </p>
      </div>
    ),
  };

  return comps[language];
};

TarifverbundkarteTopicInfo.propTypes = propTypes;
TarifverbundkarteTopicInfo.defaultProps = defaultProps;

export default compose(withTranslation())(TarifverbundkarteTopicInfo);
