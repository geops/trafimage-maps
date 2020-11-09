import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import constructionIcons from './images';
import './ConstructionLayerInfo.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
};

const defaultProps = {};

const ConstructionLayerInfo = ({ t, properties }) => {
  const config = properties.get('construction');
  const filename = `${config.art}_${config.ort}`.replace(
    /[^A-Z,^0-9,-_]/gi,
    '',
  );

  return (
    <div className="wkp-construction-layer-info">
      <img
        src={constructionIcons[filename]}
        draggable="false"
        alt={t('Kein Bildtext')}
      />
      {t(`${properties.key}-desc`)}
    </div>
  );
};

ConstructionLayerInfo.propTypes = propTypes;
ConstructionLayerInfo.defaultProps = defaultProps;

export default withTranslation()(ConstructionLayerInfo);
