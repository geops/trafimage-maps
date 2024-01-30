import toBase64 from "./toBase64";
import SBBWebRomanPath from "./fonts/SBBWeb-Roman.woff";
import SBBWebLightPath from "./fonts/SBBWeb-Light.woff";
import SBBWebBoldPath from "./fonts/SBBWeb-Bold.woff";
import SBBWebItalicPath from "./fonts/SBBWeb-Italic.woff";
import SBBWebUltraLightPath from "./fonts/SBBWeb-UltraLight.woff";
import SBBWebThinPath from "./fonts/SBBWeb-Thin.woff";

export const sbbWebRoman = {
  family: "SBBWeb-Roman",
  file: SBBWebRomanPath,
};

export const sbbWebLight = {
  family: "SBBWeb-Light",
  file: SBBWebLightPath,
};

export const sbbWebUltraLight = {
  family: "SBBWeb-UltraLight",
  file: SBBWebUltraLightPath,
};

export const sbbWebBold = {
  family: "SBBWeb-Bold",
  file: SBBWebBoldPath,
};

export const sbbWebItalic = {
  family: "SBBWeb-Italic",
  file: SBBWebItalicPath,
};

export const sbbWebThin = {
  family: "SBBWeb-Thin",
  file: SBBWebThinPath,
};

export const getFontBase64FontFace = async (file, fontFamily) => {
  const fontBase64 = await fetch(file)
    .then((res) => res.blob())
    .then((blob) => toBase64(blob));
  return `
    @font-face {
      src: url(${fontBase64});
      font-family: '${fontFamily}';
    }
  `;
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
 *
 * @param {object} fonts object containing a family and a base64 attribute
 */
export const getSBBFontsDefinition = async () => {
  const fontFacesPromises = sbbFontsBase64.map((font) =>
    getFontBase64FontFace(font.file, font.family),
  );
  const fontFaces = await Promise.all(fontFacesPromises);
  return `
    <defs xmlns="http://www.w3.org/2000/svg">
      <style type="text/css">
        ${fontFaces.reduce((accString, fontFace) => `${accString} ${fontFace}`, "")}
      </style>
    </defs>
    `;
};

export default sbbFontsBase64;
