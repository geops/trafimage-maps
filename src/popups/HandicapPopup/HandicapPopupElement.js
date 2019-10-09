import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const propTypes = {
  properties: PropTypes.object.isRequired,
  propertyName: PropTypes.string.isRequired,
  label: PropTypes.string,
  ausnahme: PropTypes.string,
};

const defaultProps = {
  ausnahme: null,
  label: null,
};

function PopupElement({ properties, propertyName, label, ausnahme }) {
  const { t } = useTranslation();

  if (!properties[propertyName]) {
    return null;
  }

  let content = null;
  const propLabel = label || propertyName;
  const propValue = properties[propertyName];

  switch (typeof propValue) {
    case 'boolean':
      content = (
        <>
          <b>{t(propLabel)}</b>
          &nbsp;
          {propValue ? t('vorhanden') : t('nicht vorhanden')}
        </>
      );
      break;
    case 'string': {
      const values = propValue.split('\n');

      if (ausnahme && properties[ausnahme]) {
        values.push(properties[ausnahme]);
      }

      if (values.length > 1) {
        content = (
          <>
            <div>{t(propLabel)}</div>
            <div>
              {values.map(v => (
                <div>{v}</div>
              ))}
            </div>
          </>
        );
        break;
      }

      content = (
        <>
          <b>{t(propLabel)}</b>
          &nbsp;
          <div>{values[0]}</div>
        </>
      );
      break;
    }
    default:
      break;
  }

  if (!content) {
    return null;
  }

  return <div className="wkp-handicap-popup-element">{content}</div>;
}

PopupElement.propTypes = propTypes;
PopupElement.defaultProps = defaultProps;

export default React.memo(PopupElement);
