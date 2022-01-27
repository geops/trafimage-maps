import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

/**
 * This component add tag in the htm head tag for sbb consent management.
 */
function Head({ topics, displayConsent, consentGiven, domainConsentId }) {
  const lang = 'de';
  console.log('ici', displayConsent, domainConsentId);

  const cssText = useMemo(() => {
    return consentGiven
      ? ''
      : `            
    /* Put the consent popup inside the web component */
    #onetrust-consent-sdk {
      position: absolute;
      width: 100%;
      height: 100%;
      top:0;
      left: 0;
    }

    #onetrust-consent-sdk > div {
      position: absolute !important;
    }
  `;
  }, [consentGiven]);

  if (!topics || !topics.length) {
    return null;
  }

  return (
    <>
      {/* {!consentGiven && <div id="onetrust-consent-sdk" />} */}
      <Helmet
        style={[
          {
            cssText,
          },
        ]}
      >
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
  consentGiven: PropTypes.bool,
};

Head.defaultProps = {
  topics: [],
  displayConsent: false,
  consentGiven: false,
};

export default Head;
