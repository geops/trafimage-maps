import toBase64 from "./toBase64";
import SBBWebRomanPath from "./fonts/SBBWeb-Roman.woff";
import SBBWebLightPath from "./fonts/SBBWeb-Light.woff";
import SBBWebBoldPath from "./fonts/SBBWeb-Bold.woff";
import SBBWebItalicPath from "./fonts/SBBWeb-Italic.woff";
import SBBWebUltraLightPath from "./fonts/SBBWeb-UltraLight.woff";
import SBBWebThinPath from "./fonts/SBBWeb-Thin.woff";

const sbbWebRoman = {
  family: "SBBWeb-Roman",
  file: SBBWebRomanPath,
};

const sbbWebLight = {
  family: "SBBWeb-Light",
  file: SBBWebLightPath,
};

const sbbWebUltraLight = {
  family: "SBBWeb-UltraLight",
  file: SBBWebUltraLightPath,
};

const sbbWebBold = {
  family: "SBBWeb-Bold",
  file: SBBWebBoldPath,
};

const sbbWebItalic = {
  family: "SBBWeb-Italic",
  file: SBBWebItalicPath,
};

const sbbWebThin = {
  family: "SBBWeb-Thin",
  file: SBBWebThinPath,
};

const sbbFontsBase64 = [
  sbbWebRoman,
  sbbWebLight,
  sbbWebUltraLight,
  sbbWebBold,
  sbbWebItalic,
  sbbWebThin,
];

/**
 * Get the css font face string to load the font as base 64.
 */
const cache = {};
const getFontFace = async (file, fontFamily) => {
  if (!cache[fontFamily]) {
    const response = await fetch(file);
    const blob = await response.blob();
    const fontBase64 = await toBase64(blob);
    cache[fontFamily] = `
      @font-face {
        src: url(${fontBase64});
        font-family: '${fontFamily}';
      }
    `;
  }
  return cache[fontFamily];
};

/**
 * Get SVG <defs> tag with all the SBB fonts as base64.
 * @returns
 */
export const getSBBFontsDefinition = async () => {
  const promises = sbbFontsBase64.map((font) =>
    getFontFace(font.file, font.family),
  );
  const fontFaces = await Promise.all(promises);
  const string = fontFaces.reduce(
    (accString, fontFace) => `${accString} ${fontFace}`,
    "",
  );
  return `
    <defs xmlns="http://www.w3.org/2000/svg">
      <style type="text/css">
        ${string}
      </style>
    </defs>
    `;
};

export default sbbFontsBase64;
