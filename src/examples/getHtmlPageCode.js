const getHtmlPageCode = (wcCode, scriptCode) => {
  if (!wcCode) {
    return null;
  }
  return `
<html>
  <head>
   <script src="https://unpkg.com/trafimage-maps@latest/bundle.js"></script>${
     scriptCode ? `\n   ${scriptCode}` : ""
   }
  </head>
  <body>
    <div className="width:750px;height:500px;">
      ${wcCode}
    </div>
  </body>
</html>
  `;
};

export default getHtmlPageCode;
