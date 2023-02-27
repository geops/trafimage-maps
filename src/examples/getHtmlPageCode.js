const getHtmlPageCode = (wcCode, scriptCode) => {
  if (!wcCode) {
    return null;
  }
  return `
<html>
  <head>
   <script src="https://unpkg.com/trafimage-maps@latest/bundle.js"></script>${
     scriptCode ? `\n   ${scriptCode}` : ''
   }
  </head>
  <body>
    <div>
      ${wcCode}
    </div>
  </body>
</html>
  `;
};

export default getHtmlPageCode;
