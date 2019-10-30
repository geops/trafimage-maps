import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  properties: PropTypes.object.isRequired,
  propertyName: PropTypes.string.isRequired,
};

function HandicapPopupElement({ properties, propertyName }) {
  if (!properties[propertyName]) {
    return null;
  }

  const values = properties[propertyName].split('\n');
  let content = null;

  if (values.length > 1) {
    content = (
      <div>
        {values.map(v => (
          <div>{v}</div>
        ))}
      </div>
    );
  } else {
    content = <>{values[0]}</>;
  }

  if (!content) {
    return null;
  }

  return <div className="wkp-handicap-popup-element">{content}</div>;
}

HandicapPopupElement.propTypes = propTypes;

export default React.memo(HandicapPopupElement);
