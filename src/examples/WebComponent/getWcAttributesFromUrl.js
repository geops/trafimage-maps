const getWcAttributesFromUrl = (urlString) => {
  if (!urlString) {
    return null;
  }
  const url = new URL(urlString);
  const { pathname, searchParams } = url;
  const attributes = {};

  // activeTopicKey
  const activeTopicKey = (pathname && pathname.split("/")[1]) || null;
  if (activeTopicKey) {
    attributes.activeTopicKey = activeTopicKey;
  }

  // baselayer
  const baseLayer = searchParams.get("baseLayer");
  if (baseLayer) {
    attributes.baseLayer = baseLayer;
  }

  // layers
  let layersVisibility = "";
  const layers = searchParams.get("layersVisibility");
  if (layers) {
    layersVisibility += layers
      .split(",")
      .map((d) => `${d}=true`)
      .join(",");
    attributes.layersVisibility = layersVisibility;
  }

  // disabled
  const elements = searchParams.get("elements");
  if (elements) {
    const elementsString = `${elements
      .split(",")
      .map((e) => `${e}=false`)
      .join(",")},permalink=false`;
    attributes.elements = elementsString;
  } else {
    attributes.elements = "permalink=false";
  }

  // language
  const language = searchParams.get("language");
  if (language) {
    attributes.language = language;
  }

  // center
  const center = searchParams.get("center");
  const validateCoords = (val) =>
    val &&
    /^\[(-)?(?:[1-9]\d*|0)(?:\.\d+)?,(-)?(?:[1-9]\d*|0)(?:\.\d+)?\]$/.test(
      val.toString().replace(/ /g, ""),
    );
  if (validateCoords(center)) {
    attributes.center = center;
  }

  // zoom
  const zoom = searchParams.get("zoom");
  if (zoom) {
    attributes.zoom = zoom;
  }

  // embedded
  const embedded = searchParams.get("embedded");
  if (embedded === "true") {
    attributes.embedded = embedded;
  }

  // lineName
  const lineName = searchParams.get("lineName");
  if (lineName) {
    attributes.lineName = lineName;
  }

  return attributes;
};

export default getWcAttributesFromUrl;
