import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

/**
 * This component adds a script tag in the HTML head for SBB consent management.
 */
function Head({ topics, displayConsent, domainConsentId }) {
  const language = useSelector((state) => state.app.language);

  if (!displayConsent || !topics || !topics.length || !domainConsentId) {
    return null;
  }

  // By request from colleagues when the domain is not the one configured
  // on one trust we want that the site does a fake save of the user consent
  // after click on the button. It's avoid to display the consent everytime.
  // We test localhost: so that doesn't impact jest tests.
  if (/localhost:|trafimage\.geops\.ch|\.app/.test(window.location.hostname)) {
    // Simulate that the consent has already been given.
    if (window.localStorage.getItem('wkp.fake.consent') === 'true') {
      return null;
    }
    window.localStorage.setItem('wkp.fake.consent', true);
  }

  return (
    <>
      <Helmet>
        <script
          type="text/javascript"
          src={`https://cdn.cookielaw.org/consent/${domainConsentId}/OtAutoBlock.js`}
        />
        <script
          data-cy="consent-script"
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          type="text/javascript"
          charset="UTF-8"
          data-domain-script={domainConsentId}
          data-language={`${language}-ch`}
        />
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
  domainConsentId: PropTypes.string,
};

Head.defaultProps = {
  topics: [],
  displayConsent: false,
  domainConsentId: null,
};

export default React.memo(Head);
