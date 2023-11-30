import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useMatomo } from "@jonkoops/matomo-tracker-react";
import {
  LS_MATOMO_USER_SESSION_TIMER,
  LS_MATOMO_TOPIC_VISITED,
  MATOMO_TOPIC_CHANGE_ACTION,
  MATOMO_TOPIC_CHANGE_TIMER,
} from "../../utils/constants";

function MatomoTracker() {
  const { trackPageView, trackEvent, pushInstruction } = useMatomo();
  const disableCookies = useSelector((state) => state.app.disableCookies);
  const consentGiven = useSelector((state) => state.app.consentGiven);
  const activeTopicKey = useSelector((state) => state.app.activeTopic?.key);

  // Start tracking page view when the consent has been given
  useEffect(() => {
    if (!trackPageView || !pushInstruction || !consentGiven) {
      return;
    }

    pushInstruction("setConsentGiven");

    if (disableCookies) {
      // it's important that this instruction happens after the setConsentGiven instruction.
      pushInstruction("disableCookies");
    }

    trackPageView();

    // Start the clock to avoid duplicate 'User topic change' event tracking.
    localStorage?.setItem(LS_MATOMO_USER_SESSION_TIMER, Date.now());
    localStorage?.setItem(LS_MATOMO_TOPIC_VISITED, "");
  }, [disableCookies, consentGiven, trackPageView, pushInstruction]);

  // Track topic change event within 30 min.
  useEffect(() => {
    if (!activeTopicKey || !consentGiven || !trackEvent || !localStorage) {
      return;
    }
    const startDate = localStorage?.getItem(LS_MATOMO_USER_SESSION_TIMER) || 0;
    const topicVisited = localStorage?.getItem(LS_MATOMO_TOPIC_VISITED) || "";

    // A matomo user session is 30 min by default.
    if (
      Date.now() - startDate > MATOMO_TOPIC_CHANGE_TIMER ||
      topicVisited.indexOf(`${activeTopicKey},`) === -1
    ) {
      // within 30 min
      // Track the topic change
      trackEvent({
        category: activeTopicKey,
        action: MATOMO_TOPIC_CHANGE_ACTION,
      });
      localStorage?.setItem(
        LS_MATOMO_TOPIC_VISITED,
        `${topicVisited + activeTopicKey},`,
      );
    }
  }, [activeTopicKey, trackEvent, consentGiven]);

  return null;
}

export default React.memo(MatomoTracker);
