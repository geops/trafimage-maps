import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';

const propTypes = {
  t: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

const ZweitausbildungSubLayerInfo = ({ t, properties, staticFilesUrl }) => {
  const { infos } = properties.get('zweitausbildung');
  const { title, legend } = infos;

  return (
    <div className="wkp-zweitausbildung-sub-layer-info">
      {title ? (
        <div className="wkp-zweitausbildung-sub-layer-info-title">
          {t(title)}
        </div>
      ) : null}
      <div className="wkp-zweitausbildung-sub-layer-info-legend">
        {legend.map((item) => (
          <div key={item.name}>
            <img
              src={`${staticFilesUrl}/img/layers/zweitausbildung/${item.image}`}
              draggable="false"
              alt={t('Kein Bildtext')}
            />
            {t(item.name)}
          </div>
        ))}
      </div>
    </div>
  );
};

ZweitausbildungSubLayerInfo.propTypes = propTypes;

export default compose(withTranslation())(ZweitausbildungSubLayerInfo);
