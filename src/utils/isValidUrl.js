// Prevent malicious execution

const urlRegex = /^(wss:|https?:)\/\//;

const isValidUrl = (url) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const parsedUrl = new URL(url);
    return urlRegex.test(url);
  } catch (e) {
    return false;
  }
};

export default isValidUrl;
