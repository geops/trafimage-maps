import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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
        <div>
          <u>{t(propLabel)}</u>
        </div>
        <div>
          {values.map(v => (
            <div>{v}</div>
          ))}
        </div>
      </>
    );
  } else {
    content = (
      <>
        <u>{t(propLabel)}</u>: {values[0]}
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
