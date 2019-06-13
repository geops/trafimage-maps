# geOps react-spatial Starter

[![npm](https://img.shields.io/npm/v/%40geops%2Freact-spatial-starter.svg)](https://www.npmjs.com/package/%40geops%2Freact-spatial-starter)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

This library provides a starter kit to create a web map application based on [React Spatial](https://github.com/geops/react-spatial).


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

In your App.js file:
```bash
import React, { Component } from 'react';
import thisApp from '<this-app-package>';

class App extends Component {
  render() {
    return (
      <div className="App">
        <thisApp
          props1={props1}
          props2={props2}
        />
      </div>
    );
  }
}

export default App;
```

Props can be passed to the App:
```bash
<thisApp
  props1={props1}
  props2={props2}
/>
```
