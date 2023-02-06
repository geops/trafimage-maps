const getDataFromUrl = (urlString, htmlCode = true) => {
  if (!urlString) {
    return null;
  }
  const url = new URL(urlString);
  const { pathname, searchParams } = url;
  const code = [];
  code.push('<trafimage-maps ');
  code.push(`\n\tapiKey="${window.apiKey}"`);
  const attributes = {};

  // activeTopicKey
  const activeTopicKey = (pathname && pathname.split('/')[1]) || null;
  if (activeTopicKey) {
    code.push(`\n\tactiveTopicKey="${activeTopicKey}"`);
    attributes.activeTopicKey = activeTopicKey;
  }

  // layers
  let layersVisibility = searchParams.get('layersVisibility');
  if (layersVisibility) {
    layersVisibility += layersVisibility
      .split(',')
      .map((d) => `${d}=true`)
      .join(',');
    code.push(`\n\tlayersVisibility="${layersVisibility}"`);
    attributes.layersVisibility = layersVisibility;
  }

  // disabled
  const elements = searchParams.get('elements');
  if (elements) {
    const elementsString = elements
      .split(',')
      .map((e) => `${e}=false`)
      .join(',');
    code.push(`\n\telements="${elementsString}"`);
    attributes.elements = elementsString;
  }

  // language
  const language = searchParams.get('language');
  if (language) {
    code.push(`\n\tlanguage="${language}"`);
    attributes.language = language;
  }

  // center
  const center = searchParams.get('center');
  const validateCoords = (val) =>
    val &&
    /^\[(?:[1-9]\d*|0)(?:\.\d+)?,(?:[1-9]\d*|0)(?:\.\d+)?\]$/.test(
      val.toString().replace(/ /g, ''),
    );
  if (validateCoords(center)) {
    code.push(`\n\tcenter="${center}"`);
    attributes.center = center;
  }

  // zoom
  const zoom = searchParams.get('zoom');
  if (zoom) {
    code.push(`\n\tzoom="${zoom}"`);
    attributes.zoom = zoom;
  }

  // embedded
  const embedded = searchParams.get('embedded');
  if (embedded === 'true') {
    code.push(`\n\tembedded="${embedded}"`);
    attributes.embedded = embedded;
  }

  code.push('/>');
  return htmlCode ? code.join('') : attributes;
};

export default getDataFromUrl;
