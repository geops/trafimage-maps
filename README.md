# geOps react-spatial Starter

[![npm](https://img.shields.io/npm/v/%40geops%2Freact-spatial-starter.svg)](https://www.npmjs.com/package/%40geops%2Freact-spatial-starter)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

This repo contains the code of the Trafimage Map Portal and other applications build on it.
Components are based on [react-spatial](https://github.com/geops/react-spatial).


See [demo](https://trafimage-maps.geops.ch).


## Technologies
* react
* redux
* react-router
* enzyme
* jest
* cypress
* react-spatial
* eslint with airbnb
* prettier
* sass

## Getting Started

Install:
```bash
yarn install
```

Start:
```bash
yarn start
```

Publish as NPM package:

* Build to publish:
```bash
yarn build:es
```

* Publish:
```bash
yarn publish:build
```

## Use as ES6 module:

When this app is published as npm package, it can be integrated easily in other applications, as ES6 module:

Install
```bash
npm install <this-app-package>
```
