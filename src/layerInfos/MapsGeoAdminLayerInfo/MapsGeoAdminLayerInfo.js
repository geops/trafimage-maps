/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

const propTypes = {
  language: PropTypes.string.isRequired,
  properties: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

const footer = {
  de: (
    <span>
      Mehr Informationen unter{' '}
      <a
        href="https://map.geo.admin.ch/?topic=bafu&lang=de"
        target="_blank"
        rel="noreferrer"
      >
        map.geo.admin.ch
      </a>
    </span>
  ),
  fr: (
    <span>
      Plus informations sur{' '}
      <a
        href="https://map.geo.admin.ch/?topic=bafu&lang=fr"
        target="_blank"
        rel="noreferrer"
      >
        map.geo.admin.ch
      </a>
    </span>
  ),
  it: (
    <span>
      Piú informazioni su{' '}
      <a
        href="https://map.geo.admin.ch/?topic=bafu&lang=it"
        target="_blank"
        rel="noreferrer"
      >
        map.geo.admin.ch
      </a>
    </span>
  ),
  en: (
    <span>
      More information at{' '}
      <a
        href="https://map.geo.admin.ch/?topic=bafu&lang=en"
        target="_blank"
        rel="noreferrer"
      >
        map.geo.admin.ch
      </a>
    </span>
  ),
};

function MapsGeoAdminLayerInfo({ language, t, properties }) {
  const [legendHtml, setLegendHtml] = useState(null);

  useEffect(() => {
    const fetchLegend = () => {
      const legendKey = properties.get('legendKey');
      fetch(
        `https://api3.geo.admin.ch/rest/services/all/MapServer/${legendKey}/legend?lang=${language}`,
      )
        .then((res) => res.text())
        .then((text) => {
          const node = document.createElement('div');
          node.innerHTML = text;
          setLegendHtml(node);
        });
    };
    fetchLegend();
  }, [language, properties]);

  return (
    <div className="wkp-maps-geo-admin-layer-info">
      {legendHtml && (
        <div
          dangerouslySetInnerHTML={{
            __html: legendHtml.innerHTML,
          }}
        />
      )}
      <div className="wkp-maps-geo-admin-layer-info-footer">
        <p className="bod-title">
          <span>{t('Legende')}</span>
        </p>
        {legendHtml && (
          <div
            className="wkp-maps-geo-admin-layer-info-img"
            dangerouslySetInnerHTML={{
              __html:
                legendHtml.getElementsByClassName('img-container')[0].innerHTML,
            }}
          />
        )}
        {footer[language]}
      </div>
    </div>
  );
}

MapsGeoAdminLayerInfo.propTypes = propTypes;

export default withTranslation()(MapsGeoAdminLayerInfo);
