import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const propTypes = {
  properties: PropTypes.object.isRequired,
  propertyName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

function HandicapPopupElement({ properties, propertyName, label }) {
  const { t } = useTranslation();

  if (!properties[propertyName]) {
    return null;
  }

  const propLabel = label || propertyName;
  const values = properties[propertyName].split('\n');
  let content = null;

  if (values.length > 1) {
    content = (
      <>
        <div className="wkp-handicap-popup-field-title">{t(propLabel)}</div>
        <div className="wkp-handicap-popup-field-body">
          {values.map((v, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={idx}>{v}</div>
          ))}
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div className="wkp-handicap-popup-field-title">{t(propLabel)}</div>
        <div className="wkp-handicap-popup-field-body">{values[0]}</div>
      </>
    );
  }

  if (!content) {
    return null;
  }

  return <div className="wkp-handicap-popup-element">{content}</div>;
}

HandicapPopupElement.propTypes = propTypes;

export default React.memo(HandicapPopupElement);
