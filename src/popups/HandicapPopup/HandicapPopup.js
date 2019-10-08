import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import Feature from 'ol/Feature';
import './HandicapPopup.scss';

const propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

function HandicapPopup({ t, language, feature }) {
  const properties = feature.getProperties();
  const propertyKeys = Object.keys(properties);
  const displayProperties = {};
  const invalidLanguages = ['de', 'fr', 'it', 'en'].filter(l => l !== language);

  for (let i = 0; i < propertyKeys.length; i += 1) {
    const key = propertyKeys[i];
    const val = properties[key];

    if (
      val &&
      typeof val !== 'object' &&
      !invalidLanguages.find(l => key.endsWith(`_${l}`))
    ) {
      if (typeof properties[key] === 'boolean') {
        displayProperties[key] = val ? t('vorhanden') : t('nicht vorhanden');
      } else {
        displayProperties[key] = val;
      }
    }
  }

  return (
    <ul>
      {Object.entries(displayProperties).map(([k, v]) => (
        <li>
          {t(k)}: {t(v)}
        </li>
      ))}
    </ul>
  );
}

const mapStateToProps = state => ({
  language: state.app.language,
});

const mapDispatchToProps = {};

HandicapPopup.propTypes = propTypes;

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HandicapPopup);
