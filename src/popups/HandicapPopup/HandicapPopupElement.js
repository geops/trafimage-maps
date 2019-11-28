import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const propTypes = {
  properties: PropTypes.object.isRequired,
  propertyName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const emailTester = /[a-zA-Z0-9._+%-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}/gm;

// eslint-disable-next-line react/no-array-index-key
const mailTo = (email, idx) => (
  <a key={idx} href={`mailto:${email}`}>
    {email}
  </a>
);

const replaceLinks = (intialText, matched) => {
  // Construct an RegExp to capture all matched emails.
  const regularExp = matched.reduce(
    (prevVal, currVal, currentIndex) =>
      currentIndex === 0 ? prevVal : `${prevVal}|(${currVal})`,
    `(${matched[0]})`,
  );
  const textArray = intialText
    .split(new RegExp(regularExp, 'g'))
    .filter(v => v !== undefined && v !== '');

  const newTextArray = textArray.map((text, idx) => {
    // eslint-disable-next-line react/no-array-index-key
    let elementToReturn = <span key={idx}>{text}</span>;
    matched.forEach(match => {
      if (text === match) {
        elementToReturn = mailTo(match, idx);
      }
    });
    return elementToReturn;
  });
  return newTextArray;
};

const renderLinks = intialText => {
  let emailMatches = intialText.match(emailTester);
  if (emailMatches) {
    // Remove duplicates from match array.
    emailMatches = emailMatches.sort().filter((item, pos, ary) => {
      return !pos || item !== ary[pos - 1];
    });

    return replaceLinks(intialText, emailMatches);
  }
  return intialText;
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
            <div key={idx}>{renderLinks(v)}</div>
          ))}
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div className="wkp-handicap-popup-field-title">{t(propLabel)}</div>
        <div className="wkp-handicap-popup-field-body">
          {renderLinks(values[0])}
        </div>
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
