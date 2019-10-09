import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  t: PropTypes.func.isRequired,
  properties: PropTypes.shape.isRequired,
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  ausnahme: PropTypes.string,
};

const defaultProps = {
  ausnahme: null,
};

function PopupElement({ t, properties, key, name, ausnahme }) {
  if (!properties[key]) {
    return null;
  }

  switch (typeof properties[key]) {
    case 'boolean':
      return (
        <div className="handicap-popup-element">
          <b>{t(name)}</b>
          &nbsp;
          {properties[key] ? t('vorhanden') : t('nicht vorhanden')}
        </div>
      );
    case 'string': {
      const values = properties[key].split('\n');

      if (ausnahme && properties[ausnahme]) {
        values.push(properties[ausnahme]);
      }

      if (values.length > 1) {
        return (
          <div className="handicap-popup-element">
            <div>{t(name)}</div>
            <div>
              {values.map(v => (
                <div>{v}</div>
              ))}
            </div>
          </div>
        );
      }

      return (
        <div className="handicap-popup-element">
          <b>{t(name)}</b>
          &nbsp;
          <div>{values[0]}</div>
        </div>
      );
    }
    default:
      return null;
  }
}

PopupElement.propTypes = propTypes;
PopupElement.defaultProps = defaultProps;

export default compose(withTranslation())(PopupElement);
