const getCodeWithApiKey = async (pathToFile, apiKey) => {
  const text = await fetch(pathToFile).then((res) => res.text());
  return text.replace('<apiKey>', `"${apiKey}"`);
};

export default getCodeWithApiKey;
