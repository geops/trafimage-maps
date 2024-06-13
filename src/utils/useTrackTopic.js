import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getTrackingEnv } from "./trackingUtils";

let prevUrl;

function useTrackTopic(topicKey) {
  const { i18n } = useTranslation();
  useEffect(() => {
    const env = getTrackingEnv();
    if (env && topicKey) {
      window.digitalDataLayer = window.digitalDataLayer || [];
      window.digitalDataLayer.push({
        pageInstanceID:
          env === "prod"
            ? "TODO: prod pageInstanceID"
            : "TODO: stag pageInstanceID",
        page: {
          pageInfo: {
            topic: topicKey,
            destinationURL: window.location.href,
            destinationURI: window.location.pathname,
            referringURL: prevUrl || document.referrer,
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
  }, [i18n.language, topicKey]);
}

export default useTrackTopic;
