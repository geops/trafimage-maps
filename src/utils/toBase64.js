/**
 * Encodes a file to base64 string
 * @param {*} file
 * @returns promise
 */
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default toBase64;
