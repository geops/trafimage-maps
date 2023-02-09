const getHtmlPageCode = (wcCode) => {
  if (!wcCode) {
    return null;
  }
  return `
<html>
  <head>
   <script src="https://unpkg.com/trafimage-maps@latest/bundle.js"></script>
  </head>
  <body>
    <div style="width:800px;height:600px;">
      ${wcCode}
    </div>
  </body>
</html>
  `;
};

export default getHtmlPageCode;
