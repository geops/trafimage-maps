import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MatomoContext } from '@datapunt/matomo-tracker-react';

function MatomoTracker() {
  const matomo = useContext(MatomoContext);
  const disableCookies = useSelector((state) => state.app.disableCookies);
  const consentGiven = useSelector((state) => state.app.consentGiven);
  const activeTopicKey = useSelector((state) => state.app.activeTopic?.key);

  // Start tracking page view when the consent has been given
  useEffect(() => {
    if (!matomo || !consentGiven) {
      return;
    }
    matomo.pushInstruction('setConsentGiven');

    if (disableCookies) {
      // it's important that this instruction happens after the setConsentGiven instruction.
      matomo.pushInstruction('disableCookies');
    }

    matomo.trackPageView();

    // Start the clock to avoid duplicate 'User topic change' event tracking.
    window.localStorage?.setItem('matomo_user_session_timer', Date.now());
    window.localStorage?.setItem('matomo_topic_visited', '');
  }, [disableCookies, consentGiven, matomo]);

  // Track topic change event within 30 min.
  useEffect(() => {
    if (!activeTopicKey || !consentGiven || !matomo || !localStorage) {
      return;
    }
    const startDate = localStorage?.getItem('matomo_user_session_timer') || 0;
    const topicVisited = localStorage?.getItem('matomo_topic_visited') || '';

    // A matomo user session is 30 min by default.
    if (
      Date.now() - startDate > 30 * 60 * 1000 ||
      topicVisited.indexOf(`${activeTopicKey},`) === -1
    ) {
      // within 30 min
      // Track the topic change
      matomo.trackEvent({
        category: activeTopicKey,
        action: 'User topic change',
      });
      localStorage?.setItem(
        'matomo_topic_visited',
        `${topicVisited + activeTopicKey},`,
      );
    }
  }, [activeTopicKey, matomo, consentGiven]);

  return null;
}

export default React.memo(MatomoTracker);
