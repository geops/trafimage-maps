import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

const propTypes = {
  t: PropTypes.func.isRequired,
  // properties: PropTypes.object.isRequired,
};

const BetriebsRegionenPopup = ({ t }) => {
  return (
    <div>
      <span>{t('BetriebsRegionenPopup')}</span>
    </div>
  );
};

BetriebsRegionenPopup.propTypes = propTypes;
export default memo(withTranslation()(BetriebsRegionenPopup));
