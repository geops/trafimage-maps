import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

const propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {};

const InfoFPWTopicInfo = ({ language, t }) => {
  const desc = {
    de: (
      <span>
        Die Infografik gibt eine Übersicht zu den Änderungen und zum Ausbau des
        Angebotes per Fahrplanwechsel 2019.
      </span>
    ),
    fr: (
      <span>
        L’infographie donne un aperçu des changements et de l’aménagement de
        l’offre prévus au changement d’horaire 2019.
      </span>
    ),
    it: (
      <span>
        L’infografica fornisce una panoramica delle modifiche e dello sviluppo
        dell’offerta dal cambiamento d’orario 2019.
      </span>
    ),
  };

  return (
    <div>
      {desc[language] ? desc[language] : desc.de}
      <p>
        {t('Verantwortlich')}:
        <br />
        P-O-BP-STN-KLI-AFK,&nbsp;
        <a href="mailto:xzafk@sbb.ch">xzafk@sbb.ch</a>.
      </p>
    </div>
  );
};

InfoFPWTopicInfo.propTypes = propTypes;
InfoFPWTopicInfo.defaultProps = defaultProps;

export default withTranslation()(InfoFPWTopicInfo);
