/* eslint-disable import/no-extraneous-dependencies */
import { build, formats } from 'documentation';
import streamArray from 'stream-array';
import vfs from 'vinyl-fs';
import { readFile } from 'fs/promises';

const json = JSON.parse(
  await readFile(new URL('../doc/doc-config.json', import.meta.url)),
);

// Use geOps default template (https://github.com/geops/geops-docjs-template)
build(['src/layers/*'], { shallow: false })
  .then((out) =>
    formats.html(out, {
      name: json.appName,
      'project-url': json.githubRepo,
      theme: 'node_modules/geops-docjs-template/index.js',
    }),
  )
  .then((output) => {
    streamArray(output).pipe(vfs.dest(`./docjs`));
  });
