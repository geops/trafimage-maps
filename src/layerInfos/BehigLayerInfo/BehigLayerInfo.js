import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';
import Link from '../../components/Link';

import './BehigLayerInfo.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  infos: PropTypes.object.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

const defaultProps = {};

const BehigLayerInfo = ({ t, language, infos, staticFilesUrl }) => {
  const config = infos.get('behig');
  const key = config.status.replace(/\s/g, '_');

  const img = (
    <img
      src={`${staticFilesUrl}/img/layers/behig/${key}.png`}
      draggable="false"
      alt={t('Kein Bildtext')}
    />
  );

  const url = t('www.sbb.ch/handicap');
  const link = <Link href={`https://${url}`}>{url}</Link>;

  const desc = {
    OK: {
      de: (
        <span>
          Diese Ebene zeigt, welche Bahnhöfe dem
          Behindertengleichstellungsgesetz entsprechen und somit barrierefrei
          zugänglich sind.
        </span>
      ),
      fr: (
        <span>
          Cette couche montre les gares qui respectent la Loi sur l’égalité pour
          les handicapés (LHand) et qui sont donc accessibles sans barrières.
        </span>
      ),
      en: (
        <span>
          This layer shows which railway stations comply with The Disability
          Discrimination Act (DDA) and are therefore barrier-free.
        </span>
      ),
      it: (
        <span>
          Questo layer mostra quali stazioni ferroviarie sono conformi alla
          Legge sui disabili (LDis) e sono quindi senza barriere.
        </span>
      ),
    },
    NOCH_NICHT_OK: {
      de: (
        <span>
          Diese Ebene zeigt, welche Bahnhöfe dem
          Behindertengleichstellungsgesetz noch nicht entsprechen.
        </span>
      ),
      fr: (
        <span>
          Cette couche montre les stations qui ne sont pas encore conformes à la
          Loi sur l’égalité pour les handicapés (LHand).
        </span>
      ),
      en: (
        <span>
          This layer shows which stations do not yet comply with The Disability
          Discrimination Act (DDA).
        </span>
      ),
      it: (
        <span>
          Questo layer mostra quali stazioni non sono ancora conformi alla Legge
          sui disabili (LDis).
        </span>
      ),
    },
    BLEIBEN_NICHT_OK: {
      de: (
        <span>
          Die Ebene zeigt welche Bahnhöfe dem Behindertengleichstellungsgesetz
          auch in Zukunft nicht entsprechen werden.
        </span>
      ),
      fr: (
        <span>
          La couche montre les stations qui ne seront pas conformes à la Loi sur
          l’égalité pour les handicapés (LHand) dans l’avenir.
        </span>
      ),
      en: (
        <span>
          The layer shows which stations will not comply with the The Disability
          Discrimination Act (DDA) in the future.
        </span>
      ),
      it: (
        <span>
          Questo layer mostra quali stazioni non sono ancora conformi alla Legge
          sui disabili (LDis).
        </span>
      ),
    },
  };

  const additionalDesc = {
    OK: {},
    NOCH_NICHT_OK: {
      de: (
        <p>
          Die Umsetzungsdauer der einzelnen Bahnhöfe wird in der Übersichtskarte
          bei der entsprechenden Station angezeigt. Ab diesem Zeitpunkt ist eine
          barrierefreie Benutzung vorgesehen.
        </p>
      ),
      fr: (
        <p>
          La durée de la transformation de la gare en question est indiquée sur
          la carte de synthèse. A partir de l’année indiquée, l’utilisation sans
          barrières est prévue.
        </p>
      ),
      en: (
        <p>
          The duration of the implementation is shown on the overview map at the
          corresponding station. From this point on, barrier-free access is
          planned.
        </p>
      ),
      it: (
        <p>
          Lo layer mostra quali stazioni non saranno conformi alla Legge sui
          disabili (LDis) in futuro.
        </p>
      ),
    },
    BLEIBEN_NICHT_OK: {
      de: (
        <p>
          Ab dem Jahr 2024 werden bei diesen Bahnhöfen Ersatzlösungen (Bsp.
          Hilfestellung durch Personal) angeboten. Bis zu diesem Zeitpunkt
          werden an Stützpunktbahnhöfen Hilfestellungen angeboten, weitere
          Informationen finden Sie auf: {link}
        </p>
      ),
      fr: (
        <p>
          A partir de 2024, des solutions de substitution (p. ex. assistance par
          le personnel) seront assurées dans ces stations. Jusqu’à ce moment-là,
          l’assistance sera accordée dans les stations d’appui. Pour plus
          d’informations: {link}
        </p>
      ),
      en: (
        <p>
          From 2024 onwards, alternative solutions (e.g. assistance by staff)
          will be provided at these stations. Until then, assistance will be
          offered at base stations only. Further information can be obtained at:{' '}
          {link}
        </p>
      ),
      it: (
        <p>
          A partire dal 2024, in queste stazioni verranno offerte soluzioni
          sostitutive (ad es. assistenza da parte del personale). Fino a questo
          punto, l’assistenza sarà offerta dalle stazioni di appoggio. Ulteriori
          informazioni sono disponibili sul sito: {link}
        </p>
      ),
    },
  };

  return (
    <div className="wkp-behig-layer-info">
      <div>
        <div className="legend-table">
          {img}
          <div>{desc[key][language]}</div>
        </div>
        {additionalDesc[key][language]}
      </div>
      <p>
        {t('Aktualisierungs-Zyklus')}:
        <br />
        {t('bei Bedarf')}
      </p>
      <p>
        {t('Verantwortlich')}:
        <br />
        I-AT-KUF-PAM, Simone Mundwiler,&nbsp;
        <a href="mailto:simone.mundwiler@sbb.ch">simone.mundwiler@sbb.ch</a>.
      </p>
    </div>
  );
};

BehigLayerInfo.propTypes = propTypes;
BehigLayerInfo.defaultProps = defaultProps;

export default compose(withTranslation())(BehigLayerInfo);
