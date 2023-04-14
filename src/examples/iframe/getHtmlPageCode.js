const getHtmlPageCode = (iframeCode) => {
  if (!iframeCode) {
    return null;
  }
  return `
<html>
  <head></head>
  <body>
    <div style="width:800px;height:600px;">
      ${iframeCode}
    </div>
  </body>
</html>
  `;
};

export default getHtmlPageCode;
