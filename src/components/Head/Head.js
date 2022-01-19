import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

/**
 * This component add tag in the htm head tag for sbb consent management.
 */
function Head({ topics, displayConsent, domainConsentId }) {
  if (!topics || !topics.length) {
    return null;
  }
  const lang = 'de';
  console.log('ici');
  return (
    <>
      <Helmet>
        {displayConsent && (
          <script
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            type="text/javascript"
            charset="UTF-8"
            data-domain-script={domainConsentId}
            data-language={`${lang}-ch`}
          />
        )}
      </Helmet>
    </>
  );
}

Head.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      key: PropTypes.string,
    }),
  ),
  displayConsent: PropTypes.bool,
  domainConsentId: PropTypes.string.isRequired,
};

Head.defaultProps = {
  topics: [],
  displayConsent: false,
};

export default Head;
