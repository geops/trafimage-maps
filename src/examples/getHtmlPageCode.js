const getHtmlPageCode = (wcCode) => {
  if (!wcCode) {
    return null;
  }
  const code = [];
  code.push('<html>\n');
  code.push(`  <head>\n`);
  code.push(
    `    <script src="https://unpkg.com/trafimage-maps@latest/bundle.js"></script>\n`,
  );
  code.push(`  </head>\n`);
  code.push(`  <body>\n`);
  code.push(`    <div style="width:800px;height:600px;">\n`);
  code.push(`      ${wcCode}\n`);
  code.push(`    </div>\n`);
  code.push(`  </body>\n`);
  code.push(`</html>\n`);

  return code.join('');
};

export default getHtmlPageCode;
