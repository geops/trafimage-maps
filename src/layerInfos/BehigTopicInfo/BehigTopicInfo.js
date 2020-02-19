import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

const propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

const defaultProps = {};

const BehigTopicInfo = ({ language, t, staticFilesUrl }) => {
  const img = (
    <img
      src={`${staticFilesUrl}/img/topics/behig/behig_legend_${language}.jpg`}
      draggable="false"
      alt={t('Kein Bildtext')}
    />
  );

  const comps = {
    de: (
      <div>
        Zur Umsetzung des Behindertengleichstellungsgesetzes (BehiG) sind unter
        anderem umfangreiche Anpassungen der Infrastruktur notwendig. Die
        vorliegende Karte zeigt den aktuellen Umsetzungsstand der Bahnhöfe der
        SBB.
        <p>
          Verantwortlich:
          <br />
          I-AT-KUF-PAM, Simone Mundwiler,&nbsp;
          <a href="mailto:simone.mundwiler@sbb.ch">
            Kommunikation-Infrastruktur@sbb.ch
          </a>
          .
        </p>
        <p>{img}</p>
      </div>
    ),
    fr: (
      <div>
        La mise en œuvre de la loi sur l’égalité des personnes handicapées
        (LHand), des ajustements importants de l’infrastructure sont
        nécessaires. Cette carte indique l’état actuel des stations CFF.
        <p>
          Responsable:
          <br />
          I-AT-KUF-PAM, Simone Mundwiler,&nbsp;
          <a href="mailto:simone.mundwiler@sbb.ch">simone.mundwiler@sbb.ch</a>.
        </p>
        <p>{img}</p>
      </div>
    ),
    en: (
      <div>
        To implement the Disability Discrimination Act (DDA), extensive
        infrastructure adjustments are necessary. This map shows the current
        status of the SBB stations.
        <p>
          Responsible:
          <br />
          I-AT-KUF-PAM, Simone Mundwiler,&nbsp;
          <a href="mailto:simone.mundwiler@sbb.ch">simone.mundwiler@sbb.ch</a>.
        </p>
        <p>{img}</p>
      </div>
    ),
    it: (
      <div>
        L’attuazione della Legge sui disabili (LDis), sono necessari adeguamenti
        significativi dell’infrastruttura. Questa mappa mostra lo stato corrente
        delle stazioni FFS.
        <p>
          Responsabile:
          <br />
          I-AT-KUF-PAM, Simone Mundwiler,&nbsp;
          <a href="mailto:simone.mundwiler@sbb.ch">simone.mundwiler@sbb.ch</a>.
        </p>
        <p>{img}</p>
      </div>
    ),
  };

  return comps[language];
};

BehigTopicInfo.propTypes = propTypes;
BehigTopicInfo.defaultProps = defaultProps;

export default withTranslation()(BehigTopicInfo);
