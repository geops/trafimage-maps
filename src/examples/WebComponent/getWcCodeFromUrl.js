import getWcAttributesFromUrl from './getWcAttributesFromUrl';

const getWcCodeFromUrl = (urlString) => {
  const {
    center,
    zoom,
    elements,
    language,
    activeTopicKey,
    embedded,
    layersVisibility,
  } = getWcAttributesFromUrl(urlString);

  const code = ['<trafimage-maps', `\n\tapiKey="${window.apiKey}"`];

  if (activeTopicKey) {
    code.push(`\n\tactiveTopicKey="${activeTopicKey}"`);
  }

  if (center) {
    code.push(`\n\tcenter="${center}"`);
  }

  if (zoom) {
    code.push(`\n\tzoom="${zoom}"`);
  }

  if (language) {
    code.push(`\n\tlanguage="${language}"`);
  }

  if (elements) {
    code.push(`\n\telements="${elements}"`);
  } else {
    code.push(`\n\telements="permalink=false"`);
  }

  if (layersVisibility) {
    code.push(`\n\tlayersVisibility="${layersVisibility}"`);
  }

  if (embedded) {
    code.push(`\n\tembedded="${embedded}"`);
  }

  code.push('/>');
  return code.join('');
};

export default getWcCodeFromUrl;
