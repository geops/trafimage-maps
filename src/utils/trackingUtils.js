export function getTrackingEnv() {
  const { hostname } = window?.location || {};
  if (hostname?.includes("localhost")) {
    // TODO: Remove before merging
    return "test";
  }
  if (hostname?.includes("dev") || hostname?.includes("stag")) {
    return "stag";
  }
  if (hostname === "maps.trafimage.ch") {
    return "prod";
  }
  return null;
}

export function getTrackingLaunchScriptSrc() {
  const env = getTrackingEnv();
  if (env === "stag") {
    return "https://assets.adobedtm.com/15ff638fdec4/4c38131c34e1/launch-796133f166e5-development.min.js";
  }
  if (env === "prod") {
    return "https://assets.adobedtm.com/15ff638fdec4/4c38131c34e1/launch-02c7e7b710c9.min.js";
  }
  // TODO: set to null before merging
  return "https://example.com/";
}

export function trackEvent({
  componentName,
  componentPosition = 1,
  ...eventInfo
}) {
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
