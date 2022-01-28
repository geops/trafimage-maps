import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

/**
 * This component add tag in the htm head tag for sbb consent management.
 */
function Head({ topics, displayConsent, domainConsentId }) {
  const consentGiven = useSelector((state) => state.app.consentGiven);
  const language = useSelector((state) => state.app.language);
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
            data-language={`${language}-ch`}
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
