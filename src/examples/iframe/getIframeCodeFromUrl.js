const getIframeCodeFromUrl = (url) => {
  if (!url) {
    return null;
  }
  return `<iframe src="${url}" style="width:100%;height:100%;" />`;
};

export default getIframeCodeFromUrl;
