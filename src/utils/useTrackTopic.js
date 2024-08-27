import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getTrackingEnv } from "./trackingUtils";

let prevUrl;

function useTrackTopic() {
  const { i18n } = useTranslation();
  const activeTopic = useSelector((state) => state.app.activeTopic);

  useEffect(() => {
    if (!activeTopic || activeTopic?.noTracking) return;
    const env = getTrackingEnv();
    const isIframe = window !== window.parent;
    const trackTopicPending = !window.digitalDataLayer?.find(
      (evt) => "pageInstanceID" in evt,
    );

    if (trackTopicPending && env && i18n.language && activeTopic.key) {
      window.digitalDataLayer = window.digitalDataLayer || [];
      window.digitalDataLayer.push({
        pageInstanceID: env === "prod" ? "584988" : "584988", // For now the prod and stag IDs are the same
        page: {
          pageInfo: {
            pageName: activeTopic.key,
            destinationURL: window.location.href,
            destinationURI: window.location.pathname,
            referringURL: prevUrl || document.referrer,
            parentLocation: isIframe ? document.referrer : "",
            sysEnv: env === "prod" ? "production" : "integration",
            language: i18n.language,
          },
          category: { primaryCategory: "maps.trafimage.ch" },
        },
      });
      window.digitalDataLayer.push({
        event: { eventInfo: { eventName: "page data layer ready" } },
      });
      prevUrl = window.location.href;
    }
  }, [i18n.language, activeTopic]);
}

export default useTrackTopic;
