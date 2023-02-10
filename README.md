# trafimage-maps

[![npm](https://img.shields.io/npm/v/trafimage-maps.svg)](https://www.npmjs.com/package/trafimage-maps)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## About

This repo contains the web component used by the Trafimage Map Portal by Swiss Federal Railways SBB and other applications build on it.

## Documentation

See [demo](https://apidoc.trafimage.ch/).

## Technologies

- web-component
- react
- redux
- enzyme
- jest
- cypress
- react-spatial
- mobility-toolbox-js
- eslint with airbnb
- prettier
- sass

## Getting Started

Install:

```bash
yarn install
```

Start:

```bash
yarn start
```

## Publish as NPM package

Make sure you're on the good branch.

Usually, public version are only published from master, beta version can be published from every branches.

Using the following commands, the release version number is automatically updated depending on commit messages (tanks conventionnal commit!)

- Always test the changelog content before publishing:

```bash
yarn publish:public:dryrun
```

- Publish a public version:

```bash
yarn login # only if it's not already done.
yarn publish:public
```

- Publish a beta version:

```bash
yarn login # only if it's not already done.
yarn publish:beta
```

## Udpate dependencies problems

react-styleguidist@11.0.8: We can't update after `11.0.8`. `11.0.9` and `11.0.10` have the `CopyWebpackPlugin` bug. `11.0.11` have fixed it but another errors occurs when we run `yarn doc`. It seems jsx code is not well parsed anymore.

react@16.14.0: React 17 is not well supported by `material-ui`. In the tarifverbundkarte topic, the select box used to update the import format crashes the app when we click on it. The search component also have troubles when dev tools are open and try to navigate in the results with the keyboard.

fixpack@3.0.6: Fixpack `4.0.0` returns an exit code of 1 everytime, so it breaks the lint-staged hook. See [bug](https://github.com/HenrikJoreteg/fixpack/issues/50).

ol@6.6.1: The version `6.7.0` has some dependencies for the module `geotiff` like `txml` that the compiler can't find.

babel-preset-react-app@9: The version `10.0.0` doesn't compile the same way the files in the `build/es` folder, it removed the option `modules: false` for the preset-env. That double the size of the code when we compile in a parent project.
