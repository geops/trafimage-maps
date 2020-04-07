import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  t: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
};

const ZweitausbildungSubLayerInfo = ({ t, properties }) => {
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
          <div>
            <img
              src={`${process.env.REACT_APP_STATIC_FILES_URL}/img/layers/zweitausbildung/${item.image}`}
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
