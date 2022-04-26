import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';

const propTypes = {
  t: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

const ZweitausbildungLayerInfo = ({ t, properties, staticFilesUrl }) => {
  const { infos } = properties.get('zweitausbildung');
  const { title, legend } = infos;

  return (
    <div className="wkp-zweitausbildung-layer-info">
      <div>{t(title)}</div>
      {legend ? (
        <div className="wkp-zweitausbildung-layer-info-legend">
          <img
            src={`${staticFilesUrl}/img/layers/zweitausbildung/${legend.image}`}
            draggable="false"
            alt={t('Kein Bildtext')}
          />
          {t(legend.name)}
        </div>
      ) : null}
      <div>
        {t('Datengrundlage')}:
        <br />
        <a
          href="http://espace.sbb.ch/teams/526/1775/_layouts/DocIdRedir.aspx?ID=T0526-1440065995-48"
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('Link Übersichtsliste Geografie im Produkte-eSpace VM HR-BIL')}
        </a>
      </div>
      <div>
        {t('Aktualisierungs-Zyklus')}:
        <br />
        {t(
          'Gemäss Life Cycle Management des Produktemanagements von HR-BIL-SKK(-PM)',
        )}
      </div>
      <div>
        {t('Verantwortlich')}:
        <br />
        {t('HR-BIL-SKK-PM (VM und VS)')},
        <br />
        <a href="mailto:pm.skk.kbc@sbb.ch">pm.skk.kbc@sbb.ch</a>.
      </div>
    </div>
  );
};

ZweitausbildungLayerInfo.propTypes = propTypes;

export default compose(withTranslation())(ZweitausbildungLayerInfo);
