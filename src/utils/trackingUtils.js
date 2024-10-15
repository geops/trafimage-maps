export function getTrackingEnv() {
  const { hostname } = window?.location || {};
  if (hostname?.includes("dev") || hostname?.includes("stag")) {
    return "stag";
  }
  if (
    hostname === "maps.trafimage.ch" ||
    hostname === "trafimage-maps.sbb.ch"
  ) {
    return "prod";
  }
  return null;
}

export function getTrackingLaunchScriptSrc() {
  const env = getTrackingEnv();
  if (env === "stag") {
    return "https://assets.adobedtm.com/15ff638fdec4/97b4268d6157/launch-27b9efc6a00a-development.min.js";
  }
  if (env === "prod") {
    return "https://assets.adobedtm.com/15ff638fdec4/97b4268d6157/launch-6d0c92e1ddbe.min.js";
  }
  return null;
}

let prevUrl;

export const trackTopic = (activeTopic, language) => {
  const env = getTrackingEnv();
  const isIframe = window !== window.parent;

  if (env && activeTopic?.key && !activeTopic.noTracking) {
    const parentLocation = isIframe
      ? window.location.ancestorOrigins?.[0] || document.referrer
      : "";

    window.digitalDataLayer = window.digitalDataLayer || [];
    window.digitalDataLayer.push({
      pageInstanceID: env === "prod" ? "584988" : "584988", // For now the prod and stag IDs are the same
      page: {
        pageInfo: {
          pageName: activeTopic.key,
          destinationURL: window.location.href,
          destinationURI: window.location.pathname,
          referringURL: prevUrl || document.referrer,
          parentLocation,
          sysEnv: env === "prod" ? "production" : "integration",
          language,
        },
        category: { primaryCategory: "maps.trafimage.ch" },
      },
    });
    window.digitalDataLayer.push({
      event: { eventInfo: { eventName: "page data layer ready" } },
    });
    prevUrl = window.location.href;
  }
};

export function trackEvent(
  { componentName, componentPosition = 1, ...eventInfo },
  topic,
) {
  if (!getTrackingEnv() || topic?.noTracking) {
    return;
  }
  window.digitalDataLayer = window.digitalDataLayer || [];
  window.digitalDataLayer.push({
    event: {
      eventInfo: {
        componentPath: [
          {
            name: `Component: ${componentName}`,
            position: componentPosition,
          },
        ],
        eventName: "click",
        destination: "",
        ...eventInfo,
      },
      category: {
        primaryCategory:
          eventInfo.eventType === "download"
            ? "download"
            : "generic navigation",
      },
    },
  });
}

export default {
  getTrackingEnv,
  getTrackingLaunchScriptSrc,
  trackEvent,
};
