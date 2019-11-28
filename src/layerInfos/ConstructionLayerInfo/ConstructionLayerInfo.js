import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  t: PropTypes.func.isRequired,
  infos: PropTypes.object.isRequired,
};

const defaultProps = {};

const ConstructionLayerInfo = ({ t, infos }) => {
  const config = infos.get('construction');
  const filename = `${config.art}_${config.ort}`.replace(
    /[^A-Z,^0-9,-_]/gi,
    '',
  );

  return (
    <div>
      {t(`${infos.key}-desc`)}
      <p>
        <img
          src={`${process.env.REACT_APP_STATIC_FILES_URL}/img/layers/construction/${filename}.png`}
          draggable="false"
          alt={t('Kein Bildtext')}
        />
      </p>
    </div>
  );
};

ConstructionLayerInfo.propTypes = propTypes;
ConstructionLayerInfo.defaultProps = defaultProps;

export default compose(withTranslation())(ConstructionLayerInfo);
