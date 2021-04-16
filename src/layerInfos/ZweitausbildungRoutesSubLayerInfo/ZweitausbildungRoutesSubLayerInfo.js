import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';

const propTypes = {
  t: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  staticFilesUrl: PropTypes.string.isRequired,
};

const ZweitausbildungRoutesSubLayerInfo = ({
  t,
  properties,
  staticFilesUrl,
}) => {
  const { infos } = properties.get('zweitausbildung');
  const { title, desc, legend } = infos;
  return (
    <div className="wkp-zweitausbildung-routes-sub-layer-info">
      {t(title)}
      <div className="wkp-zweitausbildung-routes-sub-layer-info-desc">
        {t(desc)}
      </div>
      <div className="wkp-zweitausbildung-routes-sub-layer-info-legend">
        <img
          src={`${staticFilesUrl}/img/layers/zweitausbildung/${legend.image}`}
          draggable="false"
          alt={t('Kein Bildtext')}
        />
      </div>
    </div>
  );
};

ZweitausbildungRoutesSubLayerInfo.propTypes = propTypes;

export default compose(withTranslation())(ZweitausbildungRoutesSubLayerInfo);
