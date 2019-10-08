import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose } from 'lodash/fp';

const propTypes = {
  t: PropTypes.func.isRequired,
  properties: PropTypes.shape.isRequired,
  k: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  ausnahme: PropTypes.string,
};

const defaultProps = {
  ausnahme: null,
};

function PopupElement({ t, properties, k, name, ausnahme }) {
  if (!properties[k]) {
    return null;
  }

  switch (typeof properties[k]) {
    case 'boolean':
      return (
        <div className="handicap-popup-element">
          <b>{t(name)}</b>
          &nbsp;
          {properties[k] ? t('vorhanden') : t('nicht vorhanden')}
        </div>
      );
    case 'string': {
      const values = properties[k].split('\n');

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
