const getCodeFromUrl = (urlString) => {
  if (!urlString) {
    return null;
  }
  const url = new URL(urlString);
  const { pathname, searchParams } = url;
  const code = [];
  code.push('<trafimage-maps ');
  code.push(`\n\tapiKey="${window.apiKey}"`);

  // activeTopicKey
  const activeTopicKey = (pathname && pathname.split('/')[1]) || null;
  if (activeTopicKey) {
    code.push(`\n\tactiveTopicKey="${activeTopicKey}"`);
  }

  // baselayers
  let layersVisibility = '';
  const baselayers = searchParams.get('baselayers');
  if (baselayers) {
    // only the first is relevant
    layersVisibility = `${baselayers.split(',')[0]}=true`;
  }

  // layers
  const layers = searchParams.get('layers');
  if (layers) {
    if (layersVisibility) {
      layersVisibility += ',';
    }
    layersVisibility += layers
      .split(',')
      .map((d) => `${d}=true`)
      .join(',');
  }

  // baselayers & layers
  if (layersVisibility) {
    code.push(`\n\tlayersVisibility="${layersVisibility}"`);
  }

  // disabled
  const disabled = searchParams.get('disabled');
  if (disabled) {
    code.push(
      `\n\telements="${disabled
        .split(',')
        .map((d) => `${d}=false`)
        .join(',')}"`,
    );
  }

  // language
  const language = searchParams.get('lang');
  if (language) {
    code.push(`\n\tlanguage="${language}"`);
  }

  // center
  const x = searchParams.get('x');
  const y = searchParams.get('y');
  if (x && y) {
    code.push(`\n\tcenter="${x},${y}"`);
  }

  // zoom
  const z = searchParams.get('z');
  if (z) {
    code.push(`\n\tzoom="${z}"`);
  }

  // embedded
  const embedded = searchParams.get('embedded');
  if (embedded === 'true') {
    code.push(`\n\tembedded="${embedded}"`);
  }

  code.push('/>');
  return code.join('');
};

export default getCodeFromUrl;
