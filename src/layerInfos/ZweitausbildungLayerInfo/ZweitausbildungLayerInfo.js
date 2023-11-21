import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const propTypes = {
  properties: PropTypes.object.isRequired,
};

function ZweitausbildungLayerInfo({ properties: layer }) {
  const { t } = useTranslation();
  const staticFilesUrl = useSelector((state) => state.app.staticFilesUrl);
  const {
    infos: { title, legend },
  } = layer.get('zweitausbildung');

  return (
    <div>
      <p>{t(title)}</p>
      {!!legend && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <img
            src={`${staticFilesUrl}/img/layers/zweitausbildung/${legend.image}`}
            alt={t(legend.name)}
          />
          {t(legend.name)}
        </div>
      )}
      <p>
        {t('Datengrundlage')}:
        <br />
        <a
          href={t('overview_list_url')}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('Übersichtsliste Geografie')}
        </a>
      </p>
      <p>
        {t('Aktualisierungs-Zyklus')}:
        <br />
        {t(
          'Gemäss Life Cycle Management des Produktmanagements von HR-POK-SKK',
        )}
      </p>
      <p>
        {t('Verantwortlich')}:
        <br />
        {t('HR-POK-SKK-PM1 (KBC und VSV)')},
        <br />
        <a href="mailto:pm.skk.kbc@sbb.ch">pm.skk.kbc@sbb.ch</a>.
      </p>
    </div>
  );
}

ZweitausbildungLayerInfo.propTypes = propTypes;

export default ZweitausbildungLayerInfo;
