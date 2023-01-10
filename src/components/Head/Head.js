import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { setConsentGiven } from '../../model/app/actions';

/**
 * This component adds a script tag in the HTML head for SBB consent management.
 */
function Head({ topics, displayConsent, domainConsentId }) {
  const language = useSelector((state) => state.app.language);
  const dispatch = useDispatch();

  if (!displayConsent || !topics || !topics.length || !domainConsentId) {
    return null;
  }

  // By request from colleagues when the domain is not the one configured
  // on one trust we want that the site does a fake save of the user consent
  // after click on the button. It's avoid to display the consent everytime.
  // We test localhost:3000 so that doesn't impact jest tests (jest uses localhost/).
  if (
    /trafimage\.geops\.ch|\.app/.test(window.location.hostname) ||
    /localhost:3000/.test(window.location.href)
  ) {
    // Simulate that the consent has already been given.
    if (window.localStorage.getItem('wkp.fake.consent') === 'true') {
      dispatch(setConsentGiven(true));
      return null;
    }
    window.localStorage.setItem('wkp.fake.consent', true);
  }

  return (
    <Helmet>
      <script
        type="text/javascript"
        src={`https://cdn.cookielaw.org/consent/${domainConsentId}/OtAutoBlock.js`}
      />
      <script
        data-cy="consent-script"
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
        type="text/javascript"
        // eslint-disable-next-line react/no-unknown-property
        charset="UTF-8"
        data-domain-script={domainConsentId}
        data-language={`${language}-ch`}
      />
    </Helmet>
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
