import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const propTypes = {
  properties: PropTypes.object.isRequired,
  propertyName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const emailTester = /[a-zA-Z0-9._+%-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}/gm;
const urlTester = /(www)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/g;

const searchMatches = (intialText, tester) => {
  const matched = intialText.match(tester);
  if (matched) {
    // Remove duplicates from match array.
    return matched.sort().filter((item, pos, ary) => {
      return !pos || item !== ary[pos - 1];
    });
  }
  return [];
};

const mailTo = (email, idx) => (
  <a key={idx} href={`mailto:${email}`}>
    {email}
  </a>
);

const urlHref = (href, idx) => {
  return (
    <a
      key={idx}
      href={`http://${href}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {href}
    </a>
  );
};

const replaceLinks = (intialTextArray, matched, renderCallback) => {
  // Construct an RegExp to capture all matched emails.
  const regularExp = matched.reduce(
    (prevVal, currVal, currentIndex) =>
      currentIndex === 0 ? prevVal : `${prevVal}|(${currVal})`,
    `(${matched[0]})`,
  );

  // Split array items and flatten it.
  const flatSplitArray = intialTextArray
    .map(item => {
      if (typeof item === 'string') {
        return item
          .split(new RegExp(regularExp, 'g'))
          .filter(v => v !== undefined && v !== '');
      }
      return [item];
    })
    .reduce((accumulatorArray, currentArray) => {
      return [...accumulatorArray, ...currentArray];
    }, []);

  const newTextArray = flatSplitArray.map((text, idx) => {
    // eslint-disable-next-line react/no-array-index-key
    let substitutedElement = <span key={idx}>{text}</span>;
    matched.forEach(match => {
      if (text === match) {
        substitutedElement = renderCallback(match, idx);
      }
    });
    return substitutedElement;
  });
  return newTextArray;
};

const renderLinks = intialText => {
  const emailMatches = searchMatches(intialText, emailTester);
  const urlMatches = searchMatches(intialText, urlTester);

  let replaced = [intialText];
  if (emailMatches.length) {
    replaced = replaceLinks(replaced, emailMatches, mailTo);
  }
  if (urlMatches.length) {
    replaced = replaceLinks(replaced, urlMatches, urlHref);
  }
  return replaced;
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
