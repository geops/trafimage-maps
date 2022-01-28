import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

/**
 * This component add tag in the htm head tag for sbb consent management.
 */
function Head({ topics, displayConsent, domainConsentId }) {
  const language = useSelector((state) => state.app.language);

  if (!displayConsent || !topics || !topics.length || !domainConsentId) {
    return null;
  }

  return (
    <>
      <Helmet>
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